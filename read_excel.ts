import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('C:\\Skripsi\\Judul\\Judul 2\\APPS\\DATA_20LOGBOOK_FIXED.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Sheet Name:", sheetName);
console.log("Total Rows:", data.length);
console.log("-----------------------------------------");
console.log("Headers:");
console.log(data[0]);
console.log("-----------------------------------------");
console.log("First 3 rows of data:");
for (let i = 1; i <= 3 && i < data.length; i++) {
    console.log(data[i]);
}
