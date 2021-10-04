# Coding Skills Challenge - Declan English

This is my take on the coding skills challenge using Javascript via a local HTML interface.

## Using The Program
1. Run Index.html locally from the codingskills file
2. Click the "Choose files" button to select the appropriate .csv files for input
	- Note that at least one barcodes, catalog, and suppliers file is expected\*
3. Click the "Generate catalog file" button to create an output .csv file with merged catalogs
	- This CSV file will have the following header row: SKU,Description,Suppliers,Companies
	- Any catalog items with multiple entries under these headers will have entries delimited by a pipe (|). For example, an item which appears on catalogs for both company A and company B will have a "Companies" column entry of "A|B"
	
\*These files should follow the appropriate naming convention as demonstrated by the files in the Input folder in this repo, including the file type (barcodes, catalog, or suppliers)the company name. For example, the suppliers file for company A should be named suppliersA.csv
	
## Assumptions
The following assumptions have been made in the development of this program:
 - Items with the same SKU are identical
 - Items with the same description and supplier are identical
 - Files will be named following the naming convention as demonstrated by the files in the Input folder
 
Further assumptions may have been made during the development of this program with the output requirements taken into account.
 
~~~~~~
Below is the original content of the Coding Skills README file.

# Coding Skills Challenge

### The below describes a problem statement, make sure to read all the instructions in this readme before you start.

### Business Requirement:

- Company A have acquired Company B, A and B sell some common products, sourced from suppliers (Sometimes the same supplier, sometimes a different one). 
- The business wants to consolidate the product catalog into one superset (merged catalog). 

### There are possibilities like:

- Company A and B could have conflicting product codes (SKUs).
- Product codes might be same, but they are different products.
- Product codes are different, but they are same product.
- You should not be duplicating product records in merged catalog.
- Product on merged catalog must have information about the company it belongs to originally.  

The business provided the following information that may help in identifying a matching product:
- Products have associated suppliers, each supplier provides 1 or many barcodes for a product, 
- A product may have many suppliers,
- If any supplier barcode matches for one product of company A with Company B then we can consider that those products as the same.


So, you have following entities to play with:

<img src="./entity_diagram.png" width="800px" height="auto">



You need to produce code in your preferred language which can demonstrate following:

### Initial load
- Mega merge: All products from both companies should get merge into a common catalog
 

### Sample Data 
Please refer input folder for following CSVs:
1. [catalogA.csv](input/catalogA.csv) - Products for Company A
1. [catalogB.csv](input/catalogB.csv) - Products for Company B
1. [suppliersA.csv](input/suppliersA.csv) - List of Suppliers for Company A
1. [suppliersB.csv](input/suppliersB.csv) - List of Suppliers for Company B
1. [barcodesA.csv](input/barcodesA.csv) - Product barcodes provided by supplier for company A
1. [barcodesB.csv](input/barcodesB.csv) - Product barcodes provided by supplier for company B
1. [result_output.csv](output/result_output.csv) - The correct results based on the above sample data


### Deliverables.
- Application should be able to accept above data as csv files from input folder and must produce a merged catalog as a csv file in output folder.
- Proving your code works via unit testing is highly encouraged.
- Spend as little or as much time as you like ⌚
- The code you produce can be in any language ⭐
- The output of the efforts ❗ must be committed back into a Public Repo in Github and the URL shared back for review. 
- Document instructions on how to install and run your solution in the README.
