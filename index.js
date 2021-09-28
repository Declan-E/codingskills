//Global lists of imported objects
//In a larger system these would be encapsulated
var barcodes = [];
var items = [];
var suppliers = [];

//Import CSVs from user selection
//****fileList - HTML input element, contains files
function importFiles(fileList) {
	//Clear local memory
	barcodes = [];
	items = [];
	suppliers = [];
	for (var i = 0; i < fileList.files.length; i++) {
		if (fileList.files[i].name.split('.')[1] != 'csv') {
			alert("Incorrect file type"); //Exit if file does not have csv extension
		}
		
		parseInputFile(fileList.files[i]);
	}
}

//Parse given csv file and add each line as an object to the relevant object list
//****file - A user selected CSV file
function parseInputFile(file) {
	//Read each row and create a row object
	let reader = new FileReader();
	reader.readAsText(file);
	
	//When reader is ready
	reader.onload = function() {
		var lines = reader.result.split('\r\n');
		// First line is always headers
		switch(lines[0]) {
			case "SupplierID,SKU,Barcode":
				// Barcode
				importBarcodes(lines, file.name);
				break;
			case "SKU,Description":
				// Catalog
				importCatalog(lines, file.name);
				break;
			case "ID,Name":
				// Supplier
				importSuppliers(lines, file.name);
				break;
			default:
				alert("Unreadable file. Please ensure the file you uploaded is correct.");
}
		
	};
    reader.onerror = function() {
		alert("Unreadable file. Please ensure the file you uploaded is correct.");
	};
}

//Import given lines into barcodes objects
//****fileLines - Array of lines imported for file (string array)
//****fileName  - Name of file with extension. Naming convention assumes "barcodes"+company_name+".csv"
function importBarcodes(fileLines, fileName) {
	//Verify file name & get company name
	var company = '';
	company = fileName.split('.')[0]; //Remove extension
	company = company.split("barcodes")[1]; //Assume file name follows convention
	if (company == undefined) {
		alert("Unreadable file. Please ensure the file you uploaded is correct.");
	}
	//SupplierID,SKU,Barcode,Company
	for (var i=1; i < fileLines.length; i++) { //Exclude header line 0
		if (fileLines[i] == '') return; //Account for empty trailing line
		var barcodeData = fileLines[i].split(',');
		var newBarcode = {supplierID:barcodeData[0], SKU:barcodeData[1], Barcode:barcodeData[2], Company:company};
		barcodes.push(newBarcode);
	}
}

//Import given lines into catalogs objects
//****fileLines - Array of lines imported for file (string array)
//****fileName  - Name of file with extension. Naming convention assumes "catalog"+company_name+".csv"
function importCatalog(fileLines, fileName) {
	//Verify file name & get company name
	var company = '';
	company = fileName.split('.')[0]; //Remove extension
	company = company.split("catalog")[1]; //Assume file name follows convention
	if (company == undefined) {
		alert("Unreadable file. Please ensure the file you uploaded is correct.");
	}
	//SKU,Description,Company
	for (var i=1; i < fileLines.length; i++) { //Exclude header line 0
		if (fileLines[i] == '') return; //Account for empty trailing line
		var catalogData = fileLines[i].split(',');
		var newItem = {SKU:catalogData[0], Description:catalogData[1], Company:company};
		items.push(newItem);
	}
}

//Import given lines into suppliers objects
//****fileLines - Array of lines imported for file (string array)
//****fileName  - Name of file with extension. Naming convention assumes "supplier"+company_name+".csv"
function importSuppliers(fileLines,fileName) {
	//Verify file name & get company name
	var company = '';
	company = fileName.split('.')[0]; //Remove extension
	company = company.split("supplier")[1]; //Assume file name follows convention
	if (company == undefined) {
		alert("Unreadable file. Please ensure the file you uploaded is correct.");
	}
	//ID,Name,Company
	for (var i=1; i < fileLines.length; i++) { //Exclude header line 0
		if (fileLines[i] == '') return; //Account for empty trailing line
		var supplierData = fileLines[i].split(',');
		var newSupplier = {ID:supplierData[0], Name:supplierData[1], Company:company};
		suppliers.push(newSupplier);
	}
}

//Generate output catalog and save
function generateOutputFile() {
	//Alert user if files have not been uploaded - expects at least 1 barcode, catalog, and supplier
	if (barcodes.length < 1 || items.length < 1 || suppliers.length < 1) {
		alert("At least one barcode, catalog, and supplier are expected. Please check the input files and try again.");
		return 0; //Unsuccessful
	}
	cleanCatalog = removeDuplicateCatalogItems(items);
	outputCatalog = addSuppCompInfo(cleanCatalog);
	
	//Format CSV array
	var csvOutput = "SKU,Description,Suppliers,Companies\r\n";
	for (var i = 0; i < outputCatalog.length; i++) {
		csvOutput += outputCatalog[i].SKU + ',' + outputCatalog[i].Description + ',' + outputCatalog[i].supplier + ',' + outputCatalog[i].Companies; //TODO: Add companies
		if (i < outputCatalog.length - 1) { //Ingore newline for last item
			csvOutput += '\r\n';
		}
	}
	
	//Create CSV file and open download dialog
	let csvFile = new Blob([csvOutput], {type: 'text/csv'});
	var a = document.createElement('a');
	a.download = 'Merged Catalogs.csv'; //File name
	a.href = window.URL.createObjectURL(csvFile);
	a.textContent = 'Download CSV';
	a.dataset.downloadurl = ['text/csv', a.download, a.href].join(':');
	a.click(); //Trigger download by programmatically clicking download link
}

//Compare barcodes from all catalog items. Remove duplicates. Does not overwrite global catalogs array
//****catalogs - Array of catalog items to be processed. No headers
function removeDuplicateCatalogItems(catalog) {
	var processedCatalog = catalog; //Temp array so array is not altered during loops
	var duplicateCount = 0;
	for (var i = 0; i < items.length; i++) {
		for (var j = 0; j < items.length; j++) { //Start after the compared catalog item, i+1. Avoids removing the original and cuts loop time
			if (items[i].SKU == items[j].SKU) {
				duplicateCount += 1;
				if (duplicateCount > 1) {
					processedCatalog[i].Company = processedCatalog[i].Company+'|'+processedCatalog[j].Company; //List both companies delimited
					processedCatalog.splice(j,1);
				}
			}
			//TODO: Compare items to look for duplicates - duplicate name and supplier means same item even if different barcode (assumption). Different names means different items every time
		}
		duplicateCount = 0;
	}
	return processedCatalog
}

//Returns an object for output with delimited suppliers and companies added to the catalog item
//Note supplier IDs are found in barcodes objects
//****catalog - catalog to use as base for new objects
function addSuppCompInfo(catalog) {
	var outputCatalog = [];
	var supplierCount = 0;
	var arrSuppliers = [];
	var strSuppliers = '';
	for (var i = 0; i < catalog.length; i++) {
		//SKU,Description,Suppliers,Companies
		//Check for suppliers
		for (var j = 0; j < barcodes.length; j++) {
			if (catalog[i].SKU == barcodes[j].SKU) {
				if (!arrSuppliers.includes(barcodes[j].supplierID)) { //Don't duplicate suppliers
					arrSuppliers.push(barcodes[j].supplierID); //Handle multiple suppliers for same SKU
				}
			}
		}
		for (var k = 0; k < arrSuppliers.length; k++) {
			strSuppliers += arrSuppliers[k];
			if (k < arrSuppliers.length-1) {
				strSuppliers =+ '|'; Delimiter
			}
		}
		var newCatalogItem = {SKU:catalog[i].SKU, Description:catalog[i].Description, Suppliers:strSuppliers, Companies:catalog[i].Company};
		outputCatalog.push(newCatalogItem);
		arrSuppliers = [];
		strSuppliers = '';
	}
	return outputCatalog;
}