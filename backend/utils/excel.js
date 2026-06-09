// backend/utils/excel.js
// Excel Export Utilities

const ExcelJS = require('exceljs');

/**
 * Generate Excel report dari transactions
 * @param {Array} transactions - Array of transaction objects
 * @param {Array} categories - Array of category objects
 * @param {String} monthYear - Format: "2024-01" untuk January 2024
 * @returns {Buffer} Excel file buffer
 */
async function generateExcelReport(transactions, categories, monthYear) {
  const workbook = new ExcelJS.Workbook();
  
  // Sheet 1: Summary
  const summarySheet = workbook.addWorksheet('Summary');
  addSummarySheet(summarySheet, transactions, monthYear);
  
  // Sheet 2: Detailed Transactions
  const detailSheet = workbook.addWorksheet('Transactions');
  addDetailSheet(detailSheet, transactions, categories);
  
  // Sheet 3: Category Breakdown
  const categorySheet = workbook.addWorksheet('By Category');
  addCategorySheet(categorySheet, transactions, categories, monthYear);
  
  // Set column widths
  summarySheet.columns = [
    { width: 30 },
    { width: 20 }
  ];
  
  detailSheet.columns = [
    { width: 12 },
    { width: 20 },
    { width: 15 },
    { width: 15 },
    { width: 20 },
    { width: 12 }
  ];
  
  categorySheet.columns = [
    { width: 20 },
    { width: 15 },
    { width: 20 }
  ];
  
  // Convert workbook to buffer
  return await workbook.xlsx.writeBuffer();
}

/**
 * Add Summary Sheet
 */
function addSummarySheet(sheet, transactions, monthYear) {
  // Title
  const titleCell = sheet.getCell('A1');
  titleCell.value = `Financial Report - ${monthYear}`;
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: 'center' };
  sheet.mergeCells('A1:B1');
  
  // Calculations
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const net = income - expense;
  
  // Add data
  const startRow = 3;
  
  sheet.getCell(`A${startRow}`).value = 'Total Income:';
  sheet.getCell(`B${startRow}`).value = income;
  sheet.getCell(`B${startRow}`).numFmt = '[$-en-US]#,##0.00;-[$-en-US]#,##0.00';
  
  sheet.getCell(`A${startRow + 1}`).value = 'Total Expense:';
  sheet.getCell(`B${startRow + 1}`).value = expense;
  sheet.getCell(`B${startRow + 1}`).numFmt = '[$-en-US]#,##0.00;-[$-en-US]#,##0.00';
  
  sheet.getCell(`A${startRow + 2}`).value = 'Net Balance:';
  sheet.getCell(`B${startRow + 2}`).value = net;
  sheet.getCell(`B${startRow + 2}`).numFmt = '[$-en-US]#,##0.00;-[$-en-US]#,##0.00';
  sheet.getCell(`B${startRow + 2}`).font = { bold: true };
  
  const cellColor = net >= 0 ? 'CCFFCC' : 'FFCCCC'; // Green or Red
  sheet.getCell(`B${startRow + 2}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cellColor } };
}

/**
 * Add Transaction Detail Sheet
 */
function addDetailSheet(sheet, transactions, categories) {
  // Headers
  const headers = ['Date', 'Category', 'Type', 'Amount', 'Description', 'ID'];
  const headerRow = sheet.addRow(headers);
  
  // Style header
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
  headerRow.alignment = { horizontal: 'center' };
  
  // Add data rows
  transactions.forEach(transaction => {
    const category = categories.find(c => c.id === transaction.category_id);
    const row = sheet.addRow([
      new Date(transaction.date).toLocaleDateString('id-ID'),
      category ? category.name : '-',
      transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      transaction.amount,
      transaction.description || '-',
      transaction.id
    ]);
    
    // Format amount column
    row.getCell(4).numFmt = '[$-en-US]#,##0.00;-[$-en-US]#,##0.00';
    
    // Color code by type
    const typeColor = transaction.type === 'income' ? 'E2EFDA' : 'FCE4D6';
    row.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: typeColor } };
    });
  });
}

/**
 * Add Category Breakdown Sheet
 */
function addCategorySheet(sheet, transactions, categories, monthYear) {
  const categoryTotals = {};
  
  // Calculate totals per category
  transactions.forEach(transaction => {
    const category = categories.find(c => c.id === transaction.category_id);
    const categoryName = category ? category.name : 'Other';
    
    if (!categoryTotals[categoryName]) {
      categoryTotals[categoryName] = { income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      categoryTotals[categoryName].income += parseFloat(transaction.amount);
    } else {
      categoryTotals[categoryName].expense += parseFloat(transaction.amount);
    }
  });
  
  // Title
  const titleCell = sheet.getCell('A1');
  titleCell.value = `Category Breakdown - ${monthYear}`;
  titleCell.font = { bold: true, size: 12 };
  sheet.mergeCells('A1:C1');
  
  // Headers
  const headerRow = sheet.addRow(['', 'Category', 'Amount']);
  headerRow.font = { bold: true };
  
  // Add category data
  Object.entries(categoryTotals).forEach(([categoryName, amounts]) => {
    const totalAmount = amounts.income + amounts.expense;
    
    if (totalAmount > 0) {
      const row = sheet.addRow([
        '',
        categoryName,
        amounts.income > 0 ? amounts.income : amounts.expense
      ]);
      
      row.getCell(3).numFmt = '[$-en-US]#,##0.00;-[$-en-US]#,##0.00';
    }
  });
}

module.exports = {
  generateExcelReport
};
