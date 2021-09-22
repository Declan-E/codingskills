//Global lists of imported objects
//In a larger system these would be encapsulated
var barcodes = [];
var catalogs = [];
var suppliers = [];

//Import CSVs from user selection
//fileList - HTML input element, contains files
function importFiles(fileList) {
	popAll(); //Clear local memory
	for (var i = 0; i < fileList.files.length; i++) {
		if (fileList.files[i].name.split('.')[1] != 'csv') break; //Exit if file does not have csv extension
		
		parseInputFile(fileList.files[i]);
	}
}

//Pops all barcodes, catalogs, and suppliers from their arrays
function popAll() {
	while (barcodes.length > 0) {
		barcodes.pop();
	}
	while (catalogs.length > 0) {
		catalogs.pop();
	}
	while (suppliers.length > 0) {
		suppliers.pop();
	}
}

//Parse given csv file and add each line as an object to the relevant object list
//file - A user selected CSV file
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
				importBarcodes(lines);
				break;
			case "SKU,Description":
				// Catalog
				importCatalogs(lines);
				break;
			case "ID,Name":
				// Supplier
				importSuppliers(lines);
				break;
			default:
				// code block
}
		
	};
    reader.onerror = function() {
		console.log(reader.error); //Log error code to console
	};
}

//Import given lines into barcodes objects
//fileLines - Array of lines imported for file (string array)
function importBarcodes(fileLines) {
	//SupplierID,SKU,Barcode
	for (var i=1; i < fileLines.length; i++) { //Exclude header line 0
		if (fileLines[i] == '') return; //Account for empty trailing line
		var barcodeData = fileLines[i].split(',');
		var newBarcode = {supplierID:barcodeData[0], SKU:barcodeData[1], Barcode:barcodeData[2]};
		barcodes.push(newBarcode);
	}
}

//Import given lines into catalogs objects
//fileLines - Array of lines imported for file (string array)
function importCatalogs(fileLines) {
	//SKU,Description
	for (var i=1; i < fileLines.length; i++) { //Exclude header line 0
		if (fileLines[i] == '') return; //Account for empty trailing line
		var catalogData = fileLines[i].split(',');
		var newCatalog = {SKU:catalogData[0], Description:catalogData[1]};
		catalogs.push(newCatalog);
	}
}

//Import given lines into suppliers objects
//fileLines - Array of lines imported for file (string array)
function importSuppliers(fileLines) {
	//ID,Name
	for (var i=1; i < fileLines.length; i++) { //Exclude header line 0
		if (fileLines[i] == '') return; //Account for empty trailing line
		var supplierData = fileLines[i].split(',');
		var newSupplier = {ID:supplierData[0], Name:supplierData[1]};
		suppliers.push(newSupplier);
	}
}

//Generate output catalog and save as CSV to output folder
function generateOutputFile() {
	
}