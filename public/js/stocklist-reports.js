// /**
//  * Stock List Reports
//  * Handles individual item reports and full stock reports
//  */

// /**
//  * Generate individual item report
//  */
// function generateItemReport(itemId, productName) {
//   const row = event.target.closest('tr');
//   const cells = row.querySelectorAll('td');
  
//   const reportData = {
//     productName: cells[0].textContent,
//     productType: cells[1].textContent,
//     totalQuantity: cells[2].textContent,
//     quality: cells[3].textContent,
//     costPrice: cells[4].textContent,
//     sellingPrice: cells[5].textContent,
//     supplierName: cells[6].textContent,
//     totalValue: cells[7].textContent,
//     date: cells[8].textContent
//   };
  
//   printReport([reportData], `Stock Report - ${productName}`);
// }

// /**
//  * Generate full stock report
//  */
// function generateFullReport() {
//   const table = document.getElementById('stockTable');
//   const rows = table.querySelectorAll('tbody tr');
//   const reportData = [];
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length > 1) {
//       reportData.push({
//         productName: cells[0].textContent,
//         productType: cells[1].textContent,
//         totalQuantity: cells[2].textContent,
//         quality: cells[3].textContent,
//         costPrice: cells[4].textContent,
//         sellingPrice: cells[5].textContent,
//         supplierName: cells[6].textContent,
//         totalValue: cells[7].textContent,
//         date: cells[8].textContent
//       });
//     }
//   });
  
//   const grandTotal = document.querySelector('tfoot td:nth-child(2)').textContent;
//   printReport(reportData, 'Complete Stock Report', grandTotal);
// }

// /**
//  * Print stock report
//  */
// function printReport(data, title, grandTotal = null) {
//   const printWindow = window.open('', '', 'width=900,height=650');
  
//   let html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>${title}</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           padding: 30px;
//           background: #fff;
//         }
//         .report-header {
//           text-align: center;
//           margin-bottom: 30px;
//           border-bottom: 3px solid #000;
//           padding-bottom: 15px;
//         }
//         .report-header h1 {
//           margin: 0;
//           font-size: 24px;
//           text-transform: uppercase;
//         }
//         .report-header p {
//           margin: 5px 0;
//           color: #666;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 20px;
//         }
//         th, td {
//           border: 1px solid #000;
//           padding: 10px;
//           text-align: left;
//           font-size: 12px;
//         }
//         th {
//           background-color: #000;
//           color: #fff;
//           font-weight: bold;
//         }
//         tr:nth-child(even) {
//           background-color: #f5f5f5;
//         }
//         .total-row {
//           background-color: #000 !important;
//           color: #fff;
//           font-weight: bold;
//         }
//         .footer {
//           margin-top: 40px;
//           text-align: center;
//           font-size: 11px;
//           color: #888;
//         }
//         @media print {
//           body { padding: 15px; }
//           .no-print { display: none; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="report-header">
//         <h1>${title}</h1>
//         <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
//       </div>
      
//       <table>
//         <thead>
//           <tr>
//             <th>Product Name</th>
//             <th>Type</th>
//             <th>Total Qty</th>
//             <th>Quality</th>
//             <th>Cost Price</th>
//             <th>Selling Price</th>
//             <th>Supplier</th>
//             <th>Total Value</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;
  
//   data.forEach(item => {
//     html += `
//       <tr>
//         <td>${item.productName}</td>
//         <td>${item.productType}</td>
//         <td>${item.totalQuantity}</td>
//         <td>${item.quality}</td>
//         <td>${item.costPrice}</td>
//         <td>${item.sellingPrice}</td>
//         <td>${item.supplierName}</td>
//         <td>${item.totalValue}</td>
//         <td>${item.date}</td>
//       </tr>
//     `;
//   });
  
//   if (grandTotal) {
//     html += `
//       <tr class="total-row">
//         <td colspan="7" style="text-align: right;">GRAND TOTAL:</td>
//         <td><strong>${grandTotal}</strong></td>
//         <td></td>
//       </tr>
//     `;
//   }
  
//   html += `
//         </tbody>
//       </table>
      
//       <div class="footer">
//         <p>This is an automated stock report. For queries, contact your administrator.</p>
//       </div>
      
//       <div class="no-print" style="text-align: center; margin-top: 30px;">
//         <button onclick="window.print()" style="padding: 10px 20px; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin-right: 10px;">Print Report</button>
//         <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: #fff; border: none; cursor: pointer; border-radius: 5px;">Close</button>
//       </div>
//     </body>
//     </html>
//   `;
  
//   printWindow.document.write(html);
//   printWindow.document.close();
// }

// /**
//  * Generate overview report
//  */
// function generateOverviewReport() {
//   const table = document.getElementById('overviewTable');
//   const rows = table.querySelectorAll('tbody tr');
//   const reportData = [];
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length > 1) {
//       reportData.push({
//         productName: cells[0].textContent,
//         productType: cells[1].textContent,
//         totalQuantity: cells[2].textContent,
//         stockLevel: cells[3].textContent
//       });
//     }
//   });
  
//   if (reportData.length === 0) {
//     alert('No overview data available to generate report');
//     return;
//   }
  
//   printOverviewReport(reportData);
// }

// /**
//  * Print overview report
//  */
// function printOverviewReport(data) {
//   const printWindow = window.open('', '', 'width=900,height=650');
  
//   let html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Stock Overview Report</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           padding: 30px;
//           background: #fff;
//         }
//         .report-header {
//           text-align: center;
//           margin-bottom: 30px;
//           border-bottom: 3px solid #000;
//           padding-bottom: 15px;
//         }
//         .report-header h1 {
//           margin: 0;
//           font-size: 24px;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//         }
//         .report-header p {
//           margin: 5px 0;
//           color: #666;
//           font-size: 12px;
//         }
//         .summary-box {
//           background: #f8f9fa;
//           padding: 15px;
//           margin: 20px 0;
//           border-left: 4px solid #000;
//         }
//         .summary-box h3 {
//           margin: 0 0 10px 0;
//           font-size: 16px;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 20px;
//         }
//         th, td {
//           border: 1px solid #000;
//           padding: 12px;
//           text-align: left;
//           font-size: 13px;
//         }
//         th {
//           background-color: #000;
//           color: #fff;
//           font-weight: bold;
//           text-transform: uppercase;
//         }
//         tr:nth-child(even) {
//           background-color: #f5f5f5;
//         }
//         .stock-plenty {
//           background-color: #d4edda !important;
//           color: #155724;
//           font-weight: bold;
//           text-align: center;
//         }
//         .stock-restock-soon {
//           background-color: #fff3cd !important;
//           color: #856404;
//           font-weight: bold;
//           text-align: center;
//         }
//         .stock-restock-now {
//           background-color: #f8d7da !important;
//           color: #721c24;
//           font-weight: bold;
//           text-align: center;
//         }
//         .legend {
//           margin: 30px 0;
//           padding: 15px;
//           background: #f8f9fa;
//           border-radius: 5px;
//         }
//         .legend h4 {
//           margin: 0 0 10px 0;
//           font-size: 14px;
//         }
//         .legend-item {
//           display: inline-block;
//           margin-right: 20px;
//           padding: 5px 10px;
//           border-radius: 3px;
//           font-size: 12px;
//           font-weight: bold;
//         }
//         .footer {
//           margin-top: 40px;
//           text-align: center;
//           font-size: 11px;
//           color: #888;
//           border-top: 1px solid #ddd;
//           padding-top: 20px;
//         }
//         @media print {
//           body { padding: 15px; }
//           .no-print { display: none; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="report-header">
//         <h1>📊 Stock Overview Report</h1>
//         <p>Consolidated Stock Analysis by Product Name & Type</p>
//         <p>Generated on: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString()}</p>
//       </div>
      
//       <div class="summary-box">
//         <h3>Report Summary</h3>
//         <p><strong>Total Product Types:</strong> ${data.length}</p>
//         <p><strong>Total Items:</strong> ${data.reduce((sum, item) => sum + parseFloat(item.totalQuantity), 0)}</p>
//       </div>
      
//       <table>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Product Name</th>
//             <th>Type</th>
//             <th>Total Quantity</th>
//             <th>Stock Level</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;
  
//   data.forEach((item, index) => {
//     let stockClass = '';
//     if (item.stockLevel === 'Plenty in Stock') {
//       stockClass = 'stock-plenty';
//     } else if (item.stockLevel === 'Restock Soon') {
//       stockClass = 'stock-restock-soon';
//     } else {
//       stockClass = 'stock-restock-now';
//     }
    
//     html += `
//       <tr>
//         <td style="text-align: center;">${index + 1}</td>
//         <td><strong>${item.productName}</strong></td>
//         <td>${item.productType}</td>
//         <td style="text-align: center;">${item.totalQuantity}</td>
//         <td class="${stockClass}">${item.stockLevel}</td>
//       </tr>
//     `;
//   });
  
//   html += `
//         </tbody>
//       </table>
      
//       <div class="legend">
//         <h4>Stock Level Legend:</h4>
//         <span class="legend-item stock-plenty">✓ Plenty in Stock (>50)</span>
//         <span class="legend-item stock-restock-soon">⚠ Restock Soon (21-50)</span>
//         <span class="legend-item stock-restock-now">⚠ Restock Now (≤20)</span>
//       </div>
      
//       <div class="footer">
//         <p>This is an automated stock overview report generated from live stock data.</p>
//         <p>For queries or discrepancies, contact your inventory administrator.</p>
//       </div>
      
//       <div class="no-print" style="text-align: center; margin-top: 30px;">
//         <button onclick="window.print()" style="padding: 12px 24px; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin-right: 10px; font-size: 14px;">🖨️ Print Report</button>
//         <button onclick="window.close()" style="padding: 12px 24px; background: #666; color: #fff; border: none; cursor: pointer; border-radius: 5px; font-size: 14px;">✖ Close</button>
//       </div>
//     </body>
//     </html>
//   `;
  
//   printWindow.document.write(html);
//   printWindow.document.close();
// }




/**
 * Stock List Reports
 * Handles individual item reports and full stock reports
 * File: /public/js/stocklist-reports.js
 */

/**
 * Generate individual item report
 */
// function generateItemReport(itemId, productName) {
//   const row = event.target.closest('tr');
//   const cells = row.querySelectorAll('td');
  
//   const reportData = {
//     productName: cells[0].textContent,
//     productType: cells[1].textContent,
//     totalQuantity: cells[2].textContent,
//     quality: cells[3].textContent,
//     costPrice: cells[4].textContent,
//     sellingPrice: cells[5].textContent,
//     supplierName: cells[6].textContent,
//     totalValue: cells[7].textContent,
//     date: cells[8].textContent
//   };
  
//   printReport([reportData], `Stock Report - ${productName}`);
// }

// /**
//  * Generate full stock report
//  */
// function generateFullReport() {
//   const table = document.getElementById('stockTable');
//   const rows = table.querySelectorAll('tbody tr');
//   const reportData = [];
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length > 1) {
//       reportData.push({
//         productName: cells[0].textContent,
//         productType: cells[1].textContent,
//         totalQuantity: cells[2].textContent,
//         quality: cells[3].textContent,
//         costPrice: cells[4].textContent,
//         sellingPrice: cells[5].textContent,
//         supplierName: cells[6].textContent,
//         totalValue: cells[7].textContent,
//         date: cells[8].textContent
//       });
//     }
//   });
  
//   const grandTotal = document.querySelector('tfoot td:nth-child(2)').textContent;
//   printReport(reportData, 'Complete Stock Report', grandTotal);
// }

// /**
//  * Print stock report
//  */
// function printReport(data, title, grandTotal = null) {
//   const printWindow = window.open('', '', 'width=900,height=650');
  
//   let html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>${title}</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           padding: 30px;
//           background: #fff;
//         }
//         .report-header {
//           text-align: center;
//           margin-bottom: 30px;
//           border-bottom: 3px solid #000;
//           padding-bottom: 15px;
//         }
//         .report-header h1 {
//           margin: 0;
//           font-size: 24px;
//           text-transform: uppercase;
//         }
//         .report-header p {
//           margin: 5px 0;
//           color: #666;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 20px;
//         }
//         th, td {
//           border: 1px solid #000;
//           padding: 10px;
//           text-align: left;
//           font-size: 12px;
//         }
//         th {
//           background-color: #000;
//           color: #fff;
//           font-weight: bold;
//         }
//         tr:nth-child(even) {
//           background-color: #f5f5f5;
//         }
//         .total-row {
//           background-color: #000 !important;
//           color: #fff;
//           font-weight: bold;
//         }
//         .footer {
//           margin-top: 40px;
//           text-align: center;
//           font-size: 11px;
//           color: #888;
//         }
//         @media print {
//           body { padding: 15px; }
//           .no-print { display: none; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="report-header">
//         <h1>${title}</h1>
//         <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
//       </div>
      
//       <table>
//         <thead>
//           <tr>
//             <th>Product Name</th>
//             <th>Type</th>
//             <th>Total Qty</th>
//             <th>Quality</th>
//             <th>Cost Price</th>
//             <th>Selling Price</th>
//             <th>Supplier</th>
//             <th>Total Value</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;
  
//   data.forEach(item => {
//     html += `
//       <tr>
//         <td>${item.productName}</td>
//         <td>${item.productType}</td>
//         <td>${item.totalQuantity}</td>
//         <td>${item.quality}</td>
//         <td>${item.costPrice}</td>
//         <td>${item.sellingPrice}</td>
//         <td>${item.supplierName}</td>
//         <td>${item.totalValue}</td>
//         <td>${item.date}</td>
//       </tr>
//     `;
//   });
  
//   if (grandTotal) {
//     html += `
//       <tr class="total-row">
//         <td colspan="7" style="text-align: right;">GRAND TOTAL:</td>
//         <td><strong>${grandTotal}</strong></td>
//         <td></td>
//       </tr>
//     `;
//   }
  
//   html += `
//         </tbody>
//       </table>
      
//       <div class="footer">
//         <p>This is an automated stock report. For queries, contact your administrator.</p>
//       </div>
      
//       <div class="no-print" style="text-align: center; margin-top: 30px;">
//         <button onclick="window.print()" style="padding: 10px 20px; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin-right: 10px;">Print Report</button>
//         <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: #fff; border: none; cursor: pointer; border-radius: 5px;">Close</button>
//       </div>
//     </body>
//     </html>
//   `;
  
//   printWindow.document.write(html);
//   printWindow.document.close();
// }

// /**
//  * Generate overview report
//  */
// function generateOverviewReport() {
//   const table = document.getElementById('overviewTable');
//   const rows = table.querySelectorAll('tbody tr');
//   const reportData = [];
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4 && !cells[0].textContent.includes('Loading') && !cells[0].textContent.includes('No stock')) {
//       reportData.push({
//         productName: cells[0].textContent,
//         productType: cells[1].textContent,
//         totalQuantity: cells[2].textContent,
//         stockLevel: cells[3].textContent
//       });
//     }
//   });
  
//   if (reportData.length === 0) {
//     alert('No overview data available to generate report');
//     return;
//   }
  
//   printOverviewReport(reportData);
// }

// /**
//  * Print overview report
//  */
// function printOverviewReport(data) {
//   const printWindow = window.open('', '', 'width=900,height=650');
  
//   let html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Stock Overview Report</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           padding: 30px;
//           background: #fff;
//         }
//         .report-header {
//           text-align: center;
//           margin-bottom: 30px;
//           border-bottom: 3px solid #000;
//           padding-bottom: 15px;
//         }
//         .report-header h1 {
//           margin: 0;
//           font-size: 24px;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//         }
//         .report-header p {
//           margin: 5px 0;
//           color: #666;
//           font-size: 12px;
//         }
//         .summary-box {
//           background: #f8f9fa;
//           padding: 15px;
//           margin: 20px 0;
//           border-left: 4px solid #000;
//         }
//         .summary-box h3 {
//           margin: 0 0 10px 0;
//           font-size: 16px;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 20px;
//         }
//         th, td {
//           border: 1px solid #000;
//           padding: 12px;
//           text-align: left;
//           font-size: 13px;
//         }
//         th {
//           background-color: #000;
//           color: #fff;
//           font-weight: bold;
//           text-transform: uppercase;
//         }
//         tr:nth-child(even) {
//           background-color: #f5f5f5;
//         }
//         .stock-plenty {
//           background-color: #d4edda !important;
//           color: #155724;
//           font-weight: bold;
//           text-align: center;
//         }
//         .stock-restock-soon {
//           background-color: #fff3cd !important;
//           color: #856404;
//           font-weight: bold;
//           text-align: center;
//         }
//         .stock-restock-now {
//           background-color: #f8d7da !important;
//           color: #721c24;
//           font-weight: bold;
//           text-align: center;
//         }
//         .legend {
//           margin: 30px 0;
//           padding: 15px;
//           background: #f8f9fa;
//           border-radius: 5px;
//         }
//         .legend h4 {
//           margin: 0 0 10px 0;
//           font-size: 14px;
//         }
//         .legend-item {
//           display: inline-block;
//           margin-right: 20px;
//           padding: 5px 10px;
//           border-radius: 3px;
//           font-size: 12px;
//           font-weight: bold;
//         }
//         .footer {
//           margin-top: 40px;
//           text-align: center;
//           font-size: 11px;
//           color: #888;
//           border-top: 1px solid #ddd;
//           padding-top: 20px;
//         }
//         @media print {
//           body { padding: 15px; }
//           .no-print { display: none; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="report-header">
//         <h1>📊 Stock Overview Report</h1>
//         <p>Consolidated Stock Analysis by Product Name & Type</p>
//         <p>Generated on: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString()}</p>
//       </div>
      
//       <div class="summary-box">
//         <h3>Report Summary</h3>
//         <p><strong>Total Product Types:</strong> ${data.length}</p>
//         <p><strong>Total Items:</strong> ${data.reduce((sum, item) => sum + parseFloat(item.totalQuantity), 0)}</p>
//       </div>
      
//       <table>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Product Name</th>
//             <th>Type</th>
//             <th>Total Quantity</th>
//             <th>Stock Level</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;
  
//   data.forEach((item, index) => {
//     let stockClass = '';
//     if (item.stockLevel === 'Plenty in Stock') {
//       stockClass = 'stock-plenty';
//     } else if (item.stockLevel === 'Restock Soon') {
//       stockClass = 'stock-restock-soon';
//     } else {
//       stockClass = 'stock-restock-now';
//     }
    
//     html += `
//       <tr>
//         <td style="text-align: center;">${index + 1}</td>
//         <td><strong>${item.productName}</strong></td>
//         <td>${item.productType}</td>
//         <td style="text-align: center;">${item.totalQuantity}</td>
//         <td class="${stockClass}">${item.stockLevel}</td>
//       </tr>
//     `;
//   });
  
//   html += `
//         </tbody>
//       </table>
      
//       <div class="legend">
//         <h4>Stock Level Legend:</h4>
//         <span class="legend-item stock-plenty">✓ Plenty in Stock (>50)</span>
//         <span class="legend-item stock-restock-soon">⚠ Restock Soon (21-50)</span>
//         <span class="legend-item stock-restock-now">⚠ Restock Now (≤20)</span>
//       </div>
      
//       <div class="footer">
//         <p>This is an automated stock overview report generated from live stock data.</p>
//         <p>For queries or discrepancies, contact your inventory administrator.</p>
//       </div>
      
//       <div class="no-print" style="text-align: center; margin-top: 30px;">
//         <button onclick="window.print()" style="padding: 12px 24px; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin-right: 10px; font-size: 14px;">🖨️ Print Report</button>
//         <button onclick="window.close()" style="padding: 12px 24px; background: #666; color: #fff; border: none; cursor: pointer; border-radius: 5px; font-size: 14px;">✖ Close</button>
//       </div>
//     </body>
//     </html>
//   `;
  
//   printWindow.document.write(html);
//   printWindow.document.close();
// }

// console.log('Stock List Reports Script: Loaded successfully');




/**
 * Stock List Reports
 * File: /public/js/stocklist-reports.js
 */

(function() { 
  'use strict';
  
  console.log('Stock Reports Script: Loading...');

  /**
   * Generate individual item report
   */
  window.generateItemReport = function(itemId, productName) {
    try {
      const row = window.event.target.closest('tr');
      const cells = row.querySelectorAll('td');
      
      const reportData = {
        productName: cells[0].textContent,
        productType: cells[1].textContent,
        totalQuantity: cells[2].textContent,
        quality: cells[3].textContent,
        costPrice: cells[4].textContent,
        sellingPrice: cells[5].textContent,
        supplierName: cells[6].textContent,
        totalValue: cells[7].textContent,
        date: cells[8].textContent
      };
      
      printReport([reportData], 'Stock Report - ' + productName);
    } catch (error) {
      console.error('Generate Item Report Error:', error);
      alert('Error generating item report');
    }
  };

  /**
   * Generate full stock report
   */
  window.generateFullReport = function() {
    try {
      const table = document.getElementById('stockTable');
      if (!table) {
        alert('Stock table not found');
        return;
      }
      
      const rows = table.querySelectorAll('tbody tr');
      const reportData = [];
      
      rows.forEach(function(row) {
        const cells = row.querySelectorAll('td');
        if (cells.length > 1 && !cells[0].textContent.includes('No stock')) {
          reportData.push({
            productName: cells[0].textContent,
            productType: cells[1].textContent,
            totalQuantity: cells[2].textContent,
            quality: cells[3].textContent,
            costPrice: cells[4].textContent,
            sellingPrice: cells[5].textContent,
            supplierName: cells[6].textContent,
            totalValue: cells[7].textContent,
            date: cells[8].textContent
          });
        }
      });
      
      if (reportData.length === 0) {
        alert('No stock data available');
        return;
      }
      
      const grandTotalCell = document.querySelector('tfoot td:nth-child(2)');
      const grandTotal = grandTotalCell ? grandTotalCell.textContent : '0.00';
      
      printReport(reportData, 'Complete Stock Report', grandTotal);
    } catch (error) {
      console.error('Generate Full Report Error:', error);
      alert('Error generating full report');
    }
  };

  /**
   * Print report
   */
  function printReport(data, title, grandTotal) {
    try {
      const printWindow = window.open('', '', 'width=900,height=650');
      
      if (!printWindow) {
        alert('Please allow pop-ups to generate reports');
        return;
      }
      
      let html = '<!DOCTYPE html><html><head><title>' + title + '</title>';
      html += '<style>';
      html += 'body { font-family: Arial, sans-serif; padding: 30px; }';
      html += '.report-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #000; padding-bottom: 15px; }';
      html += '.report-header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }';
      html += '.report-header p { margin: 5px 0; color: #666; }';
      html += 'table { width: 100%; border-collapse: collapse; margin-top: 20px; }';
      html += 'th, td { border: 1px solid #000; padding: 10px; text-align: left; font-size: 12px; }';
      html += 'th { background-color: #000; color: #fff; font-weight: bold; }';
      html += 'tr:nth-child(even) { background-color: #f5f5f5; }';
      html += '.total-row { background-color: #000 !important; color: #fff; font-weight: bold; }';
      html += '.footer { margin-top: 40px; text-align: center; font-size: 11px; color: #888; }';
      html += '@media print { .no-print { display: none; } }';
      html += '</style></head><body>';
      
      html += '<div class="report-header">';
      html += '<h1>' + title + '</h1>';
      html += '<p>Generated on: ' + new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString() + '</p>';
      html += '</div>';
      
      html += '<table><thead><tr>';
      html += '<th>Product Name</th><th>Type</th><th>Total Qty</th>';
      html += '<th>Quality</th><th>Cost Price</th><th>Selling Price</th>';
      html += '<th>Supplier</th><th>Total Value</th><th>Date</th>';
      html += '</tr></thead><tbody>';
      
      data.forEach(function(item) {
        html += '<tr>';
        html += '<td>' + item.productName + '</td>';
        html += '<td>' + item.productType + '</td>';
        html += '<td>' + item.totalQuantity + '</td>';
        html += '<td>' + item.quality + '</td>';
        html += '<td>' + item.costPrice + '</td>';
        html += '<td>' + item.sellingPrice + '</td>';
        html += '<td>' + item.supplierName + '</td>';
        html += '<td>' + item.totalValue + '</td>';
        html += '<td>' + item.date + '</td>';
        html += '</tr>';
      });
      
      if (grandTotal) {
        html += '<tr class="total-row">';
        html += '<td colspan="7" style="text-align: right;">GRAND TOTAL:</td>';
        html += '<td><strong>' + grandTotal + '</strong></td>';
        html += '<td></td></tr>';
      }
      
      html += '</tbody></table>';
      html += '<div class="footer"><p>This is an automated stock report.</p></div>';
      html += '<div class="no-print" style="text-align: center; margin-top: 30px;">';
      html += '<button onclick="window.print()" style="padding: 10px 20px; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin-right: 10px;">Print Report</button>';
      html += '<button onclick="window.close()" style="padding: 10px 20px; background: #666; color: #fff; border: none; cursor: pointer; border-radius: 5px;">Close</button>';
      html += '</div></body></html>';
      
      printWindow.document.write(html);
      printWindow.document.close();
    } catch (error) {
      console.error('Print Report Error:', error);
      alert('Error printing report');
    }
  }

  /**
   * Generate overview report
   */
  window.generateOverviewReport = function() {
    try {
      const table = document.getElementById('overviewTable');
      if (!table) {
        alert('Overview table not found');
        return;
      }
      
      const rows = table.querySelectorAll('tbody tr');
      const reportData = [];
      
      rows.forEach(function(row) {
        const cells = row.querySelectorAll('td');
        if (cells.length === 4 && 
            !cells[0].textContent.includes('Loading') && 
            !cells[0].textContent.includes('No stock')) {
          reportData.push({
            productName: cells[0].textContent,
            productType: cells[1].textContent,
            totalQuantity: cells[2].textContent,
            stockLevel: cells[3].textContent
          });
        }
      });
      
      if (reportData.length === 0) {
        alert('No overview data available');
        return;
      }
      
      printOverviewReport(reportData);
    } catch (error) {
      console.error('Generate Overview Report Error:', error);
      alert('Error generating overview report');
    }
  };

  /**
   * Print overview report
   */
  function printOverviewReport(data) {
    try {
      const printWindow = window.open('', '', 'width=900,height=650');
      
      if (!printWindow) {
        alert('Please allow pop-ups to generate reports');
        return;
      }
      
      let html = '<!DOCTYPE html><html><head><title>Stock Overview Report</title>';
      html += '<style>';
      html += 'body { font-family: Arial, sans-serif; padding: 30px; }';
      html += '.report-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #000; padding-bottom: 15px; }';
      html += '.report-header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }';
      html += '.report-header p { margin: 5px 0; color: #666; font-size: 12px; }';
      html += '.summary-box { background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #000; }';
      html += '.summary-box h3 { margin: 0 0 10px 0; font-size: 16px; }';
      html += 'table { width: 100%; border-collapse: collapse; margin-top: 20px; }';
      html += 'th, td { border: 1px solid #000; padding: 12px; text-align: left; font-size: 13px; }';
      html += 'th { background-color: #000; color: #fff; font-weight: bold; text-transform: uppercase; }';
      html += 'tr:nth-child(even) { background-color: #f5f5f5; }';
      html += '.stock-plenty { background-color: #d4edda !important; color: #155724; font-weight: bold; text-align: center; }';
      html += '.stock-restock-soon { background-color: #fff3cd !important; color: #856404; font-weight: bold; text-align: center; }';
      html += '.stock-restock-now { background-color: #f8d7da !important; color: #721c24; font-weight: bold; text-align: center; }';
      html += '.legend { margin: 30px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }';
      html += '.legend h4 { margin: 0 0 10px 0; font-size: 14px; }';
      html += '.legend-item { display: inline-block; margin-right: 20px; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold; }';
      html += '.footer { margin-top: 40px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }';
      html += '@media print { .no-print { display: none; } }';
      html += '</style></head><body>';
      
      html += '<div class="report-header">';
      html += '<h1> Stock Overview Report</h1>';
      html += '<p>Consolidated Stock Analysis by Product Name & Type</p>';
      html += '<p>Generated on: ' + new Date().toLocaleDateString('en-GB') + ' at ' + new Date().toLocaleTimeString() + '</p>';
      html += '</div>';
      
      const totalQty = data.reduce(function(sum, item) {
        return sum + parseFloat(item.totalQuantity);
      }, 0);
      
      html += '<div class="summary-box">';
      html += '<h3>Report Summary</h3>';
      html += '<p><strong>Total Product Types:</strong> ' + data.length + '</p>';
      html += '<p><strong>Total Items:</strong> ' + totalQty + '</p>';
      html += '</div>';
      
      html += '<table><thead><tr>';
      html += '<th>#</th><th>Product Name</th><th>Type</th>';
      html += '<th>Total Quantity</th><th>Stock Level</th>';
      html += '</tr></thead><tbody>';
      
      data.forEach(function(item, index) {
        let stockClass = '';
        if (item.stockLevel === 'Plenty in Stock') {
          stockClass = 'stock-plenty';
        } else if (item.stockLevel === 'Restock Soon') {
          stockClass = 'stock-restock-soon';
        } else {
          stockClass = 'stock-restock-now';
        }
        
        html += '<tr>';
        html += '<td style="text-align: center;">' + (index + 1) + '</td>';
        html += '<td><strong>' + item.productName + '</strong></td>';
        html += '<td>' + item.productType + '</td>';
        html += '<td style="text-align: center;">' + item.totalQuantity + '</td>';
        html += '<td class="' + stockClass + '">' + item.stockLevel + '</td>';
        html += '</tr>';
      });
      
      html += '</tbody></table>';
      html += '<div class="legend">';
      html += '<h4>Stock Level Legend:</h4>';
      html += '<span class="legend-item stock-plenty">✓ Plenty in Stock (>50)</span>';
      html += '<span class="legend-item stock-restock-soon">⚠ Restock Soon (21-50)</span>';
      html += '<span class="legend-item stock-restock-now">⚠ Restock Now (≤20)</span>';
      html += '</div>';
      html += '<div class="footer"><p>This is an automated stock overview report.</p></div>';
      html += '<div class="no-print" style="text-align: center; margin-top: 30px;">';
      html += '<button onclick="window.print()" style="padding: 12px 24px; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin-right: 10px; font-size: 14px;">🖨️ Print Report</button>';
      html += '<button onclick="window.close()" style="padding: 12px 24px; background: #666; color: #fff; border: none; cursor: pointer; border-radius: 5px; font-size: 14px;">✖ Close</button>';
      html += '</div></body></html>';
      
      printWindow.document.write(html);
      printWindow.document.close();
    } catch (error) {
      console.error('Print Overview Report Error:', error);
      alert('Error printing overview report');
    }
  }

  console.log('Stock Reports Script: Loaded');

})();

// Search functionality
function searchStock() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toUpperCase();
  const table = document.getElementById('stockTable');
  const tbody = table.getElementsByTagName('tbody')[0];
  const tr = tbody.getElementsByTagName('tr');
  let visibleCount = 0;

  for (let i = 0; i < tr.length; i++) {
    const tds = tr[i].getElementsByTagName('td');
    if (tds.length === 1) continue; // Skip "No stock available" row

    let found = false;
    for (let j = 0; j < tds.length - 1; j++) {
      const td = tds[j];
      if (td) {
        const txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          found = true;
          break;
        }
      }
    }

    tr[i].style.display = found ? '' : 'none';
    if (found) visibleCount++;
  }

  const searchResults = document.getElementById('searchResults');
  searchResults.textContent = filter === ''
    ? ''
    : `Found ${visibleCount} result${visibleCount !== 1 ? 's' : ''}`;
}
