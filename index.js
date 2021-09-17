const csvFiles = []; //A list of parsed CSV files

//Generates a list of all CSV files in input folder
function getCsvFiles() {
	var fr = new FileReader();
}

//Import CSVs from user selection
//fileList - HTML input element, contains files
function importFiles(fileList) {
	for (var i = 0; i < fileList.files.length; i++) {
		console.log(fileList.files[i].name); //Test
		parseInputFile(fileList.files[i]);
	}
}

function parseInputFile(file) {
	//Read each row and create a row object
	let reader = new FileReader();
	reader.readAsText(file);
	
	//When reader is ready
	reader.onload = function() {
		console.log(reader.result); //Test
		//TODO: Format results into appropriate object and add to csvFiles list
	};
    reader.onerror = function() {
		console.log(reader.error); //Log error code to console
	};
}