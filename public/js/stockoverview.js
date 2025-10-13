// /**
//  * Stock Overview - Real-time aggregation from Stock List table
//  * Automatically updates the overview table based on the main stock list
//  * File: /public/js/stockoverview.js
//  */

// // Initialize when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//   console.log('Stock Overview: Initializing...');
  
//   // Generate overview when page loads
//   generateStockOverview();
  
//   // Observe changes to the stock table (for dynamic updates)
//   observeStockTableChanges();
  
//   console.log('Stock Overview: Initialized successfully');
// });

// /**
//  * Main function to generate stock overview from the stock list table
//  * Aggregates items by Product Name and Type
//  */
// function generateStockOverview() {
//   const stockTable = document.getElementById('stockTable');
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
  
//   if (!stockTable) {
//     console.warn('Stock Overview: Stock table not found');
//     return;
//   }
  
//   if (!overviewTableBody) {
//     console.warn('Stock Overview: Overview table body not found');
//     return;
//   }
  
//   // Get all stock rows
//   const stockRows = stockTable.querySelectorAll('tbody tr');
//   const stockData = {};
  
//   // Process each row
//   stockRows.forEach(row => {
//     const cells = row.querySelectorAll('td');
    
//     // Skip empty or incomplete rows
//     if (cells.length < 3) return;
    
//     const productName = cells[0].textContent.trim();
//     const productType = cells[1].textContent.trim();
//     const totalQtyText = cells[2].textContent.trim();
//     const totalQty = parseFloat(totalQtyText) || 0;
    
//     // Skip invalid entries
//     if (productName === '-' || productName === '' || productName.toLowerCase().includes('no stock') || totalQty === 0) {
//       return;
//     }
    
//     // Create unique key for grouping (Product Name + Type)
//     const key = `${productName}|||${productType}`;
    
//     // Aggregate quantities
//     if (stockData[key]) {
//       stockData[key].quantity += totalQty;
//     } else {
//       stockData[key] = {
//         productName: productName,
//         productType: productType,
//         quantity: totalQty
//       };
//     }
//   });
  
//   // Convert to array and sort alphabetically
//   const overviewData = Object.values(stockData).sort((a, b) => {
//     // Sort by product name first
//     if (a.productName.toLowerCase() < b.productName.toLowerCase()) return -1;
//     if (a.productName.toLowerCase() > b.productName.toLowerCase()) return 1;
//     // Then by product type
//     if (a.productType.toLowerCase() < b.productType.toLowerCase()) return -1;
//     if (a.productType.toLowerCase() > b.productType.toLowerCase()) return 1;
//     return 0;
//   });
  
//   // Clear existing overview
//   overviewTableBody.innerHTML = '';
  
//   // Populate overview table
//   if (overviewData.length === 0) {
//     overviewTableBody.innerHTML = `
//       <tr>
//         <td colspan="4" style="text-align:center; color: gray; padding: 30px;">
//           No stock data available for overview
//         </td>
//       </tr>
//     `;
//     console.log('Stock Overview: No data available');
//     return;
//   }
  
//   // Create rows for each aggregated product
//   overviewData.forEach((item, index) => {
//     const row = document.createElement('tr');
//     const stockLevel = getStockLevel(item.quantity);
    
//     row.innerHTML = `
//       <td>${item.productName}</td>
//       <td>${item.productType}</td>
//       <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
//       <td class="${stockLevel.class}">${stockLevel.text}</td>
//     `;
    
//     // Add smooth fade-in animation
//     row.style.animation = `fadeIn 0.3s ease-in ${index * 0.05}s both`;
    
//     overviewTableBody.appendChild(row);
//   });
  
//   // Add CSS animation if not already present
//   if (!document.getElementById('overview-animations')) {
//     const style = document.createElement('style');
//     style.id = 'overview-animations';
//     style.textContent = `
//       @keyframes fadeIn {
//         from {
//           opacity: 0;
//           transform: translateY(-10px);
//         }
//         to {
//           opacity: 1;
//           transform: translateY(0);
//         }
//       }
//     `;
//     document.head.appendChild(style);
//   }
  
//   console.log(`Stock Overview: Generated ${overviewData.length} unique product(s)`);
// }

// /**
//  * Determine stock level based on quantity
//  * @param {number} quantity - Total quantity of stock
//  * @returns {Object} Stock level object with text and CSS class
//  */
// function getStockLevel(quantity) {
//   if (quantity > 50) {
//     return {
//       text: 'Plenty in Stock',
//       class: 'stock-plenty'
//     };
//   } else if (quantity > 20) {
//     return {
//       text: 'Restock Soon',
//       class: 'stock-restock-soon'
//     };
//   } else {
//     return {
//       text: 'Restock Now',
//       class: 'stock-restock-now'
//     };
//   }
// }

// /**
//  * Observe changes to the stock table for real-time updates
//  * Uses MutationObserver to detect DOM changes
//  */
// function observeStockTableChanges() {
//   const stockTableBody = document.querySelector('#stockTable tbody');
  
//   if (!stockTableBody) {
//     console.warn('Stock Overview: Cannot observe - stock table body not found');
//     return;
//   }
  
//   // Create a mutation observer
//   const observer = new MutationObserver(function(mutations) {
//     // Check if there are actual changes to process
//     let shouldUpdate = false;
    
//     mutations.forEach(mutation => {
//       if (mutation.type === 'childList' || mutation.type === 'characterData') {
//         shouldUpdate = true;
//       }
//     });
    
//     if (shouldUpdate) {
//       // Debounce the update to avoid excessive recalculations
//       clearTimeout(window.stockOverviewTimeout);
//       window.stockOverviewTimeout = setTimeout(() => {
//         console.log('Stock Overview: Table changed, regenerating overview...');
//         generateStockOverview();
//       }, 500);
//     }
//   });
  
//   // Observe changes to the stock table
//   observer.observe(stockTableBody, {
//     childList: true,      // Watch for added/removed rows
//     subtree: true,        // Watch all descendants
//     characterData: true,  // Watch for text changes
//     attributes: false     // Don't watch attribute changes
//   });
  
//   console.log('Stock Overview: Monitoring stock table for changes');
// }

// /**
//  * Refresh overview manually
//  * Can be called from UI button with visual feedback
//  */
// function refreshStockOverview() {
//   console.log('Stock Overview: Manual refresh triggered');
  
//   const btn = event ? event.target : null;
  
//   // Visual feedback on button
//   if (btn) {
//     const originalText = btn.innerHTML;
//     const originalBg = btn.style.backgroundColor;
    
//     btn.innerHTML = '⟳ Refreshing...';
//     btn.disabled = true;
//     btn.style.backgroundColor = '#6c757d';
//   }
  
//   // Regenerate overview
//   generateStockOverview();
  
//   // Reset button after short delay
//   if (btn) {
//     setTimeout(() => {
//       btn.innerHTML = '✓ Refreshed!';
//       btn.style.backgroundColor = '#28a745';
      
//       setTimeout(() => {
//         btn.innerHTML = '🔄 Refresh';
//         btn.style.backgroundColor = '';
//         btn.disabled = false;
//       }, 1500);
//     }, 300);
//   }
// }

// /**
//  * Get overview statistics
//  * @returns {Object} Statistics about current stock overview
//  */
// function getOverviewStats() {
//   const overviewTable = document.getElementById('overviewTable');
//   const rows = overviewTable.querySelectorAll('tbody tr');
  
//   let stats = {
//     totalProducts: 0,
//     totalQuantity: 0,
//     plentyInStock: 0,
//     restockSoon: 0,
//     restockNow: 0
//   };
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       stats.totalProducts++;
      
//       const quantity = parseFloat(cells[2].textContent) || 0;
//       stats.totalQuantity += quantity;
      
//       const stockLevel = cells[3].textContent.trim();
//       if (stockLevel === 'Plenty in Stock') {
//         stats.plentyInStock++;
//       } else if (stockLevel === 'Restock Soon') {
//         stats.restockSoon++;
//       } else if (stockLevel === 'Restock Now') {
//         stats.restockNow++;
//       }
//     }
//   });
  
//   return stats;
// }

// /**
//  * Export overview data as JSON
//  * @returns {Array} Array of overview items
//  */
// function exportOverviewData() {
//   const overviewTable = document.getElementById('overviewTable');
//   const rows = overviewTable.querySelectorAll('tbody tr');
//   const data = [];
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       data.push({
//         productName: cells[0].textContent.trim(),
//         productType: cells[1].textContent.trim(),
//         totalQuantity: parseFloat(cells[2].textContent) || 0,
//         stockLevel: cells[3].textContent.trim()
//       });
//     }
//   });
  
//   return data;
// }

// /**
//  * Filter overview table by stock level
//  * @param {string} level - 'all', 'plenty', 'restock-soon', or 'restock-now'
//  */
// function filterOverviewByLevel(level) {
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
//   const rows = overviewTableBody.querySelectorAll('tr');
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       const stockLevelCell = cells[3];
//       const stockLevel = stockLevelCell.textContent.trim();
      
//       let shouldShow = false;
      
//       if (level === 'all') {
//         shouldShow = true;
//       } else if (level === 'plenty' && stockLevel === 'Plenty in Stock') {
//         shouldShow = true;
//       } else if (level === 'restock-soon' && stockLevel === 'Restock Soon') {
//         shouldShow = true;
//       } else if (level === 'restock-now' && stockLevel === 'Restock Now') {
//         shouldShow = true;
//       }
      
//       row.style.display = shouldShow ? '' : 'none';
//     }
//   });
  
//   console.log(`Stock Overview: Filtered by level - ${level}`);
// }

// /**
//  * Search/filter overview table by product name or type
//  * @param {string} searchTerm - Search term to filter by
//  */
// function searchOverview(searchTerm) {
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
//   const rows = overviewTableBody.querySelectorAll('tr');
//   const term = searchTerm.toLowerCase().trim();
  
//   if (!term) {
//     // Show all rows if search is empty
//     rows.forEach(row => {
//       row.style.display = '';
//     });
//     return;
//   }
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       const productName = cells[0].textContent.toLowerCase();
//       const productType = cells[1].textContent.toLowerCase();
      
//       const matches = productName.includes(term) || productType.includes(term);
//       row.style.display = matches ? '' : 'none';
//     }
//   });
  
//   console.log(`Stock Overview: Searched for "${searchTerm}"`);
// }

// // Export functions for use in other scripts if needed
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = {
//     generateStockOverview,
//     refreshStockOverview,
//     getOverviewStats,
//     exportOverviewData,
//     filterOverviewByLevel,
//     searchOverview
//   };
// }

// console.log('Stock Overview Script: Loaded successfully');





/**
 * Stock Overview - Real-time aggregation from Stock List table
 * Automatically updates the overview table based on the main stock list
 * File: /public/js/stockoverview.js
 */

// // Initialize when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//   console.log('Stock Overview: Initializing...');
  
//   // Generate overview when page loads
//   generateStockOverview();
  
//   // Observe changes to the stock table (for dynamic updates)
//   observeStockTableChanges();
  
//   console.log('Stock Overview: Initialized successfully');
// });

// /**
//  * Main function to generate stock overview from the stock list table
//  * Aggregates items by Product Name and Type
//  */
// function generateStockOverview() {
//   const stockTable = document.getElementById('stockTable');
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
  
//   if (!stockTable) {
//     console.warn('Stock Overview: Stock table not found');
//     return;
//   }
  
//   if (!overviewTableBody) {
//     console.warn('Stock Overview: Overview table body not found');
//     return;
//   }
  
//   // Get all stock rows
//   const stockRows = stockTable.querySelectorAll('tbody tr');
//   const stockData = {};
  
//   // Process each row
//   stockRows.forEach(row => {
//     const cells = row.querySelectorAll('td');
    
//     // Skip empty or incomplete rows
//     if (cells.length < 3) return;
    
//     const productName = cells[0].textContent.trim();
//     const productType = cells[1].textContent.trim();
//     const totalQtyText = cells[2].textContent.trim();
//     const totalQty = parseFloat(totalQtyText) || 0;
    
//     // Skip invalid entries
//     if (productName === '-' || productName === '' || productName.toLowerCase().includes('no stock') || totalQty === 0) {
//       return;
//     }
    
//     // Create unique key for grouping (Product Name + Type)
//     const key = `${productName}|||${productType}`;
    
//     // Aggregate quantities
//     if (stockData[key]) {
//       stockData[key].quantity += totalQty;
//     } else {
//       stockData[key] = {
//         productName: productName,
//         productType: productType,
//         quantity: totalQty
//       };
//     }
//   });
  
//   // Convert to array and sort alphabetically
//   const overviewData = Object.values(stockData).sort((a, b) => {
//     // Sort by product name first
//     if (a.productName.toLowerCase() < b.productName.toLowerCase()) return -1;
//     if (a.productName.toLowerCase() > b.productName.toLowerCase()) return 1;
//     // Then by product type
//     if (a.productType.toLowerCase() < b.productType.toLowerCase()) return -1;
//     if (a.productType.toLowerCase() > b.productType.toLowerCase()) return 1;
//     return 0;
//   });
  
//   // Clear existing overview
//   overviewTableBody.innerHTML = '';
  
//   // Populate overview table
//   if (overviewData.length === 0) {
//     overviewTableBody.innerHTML = `
//       <tr>
//         <td colspan="4" style="text-align:center; color: gray; padding: 30px;">
//           No stock data available for overview
//         </td>
//       </tr>
//     `;
//     console.log('Stock Overview: No data available');
//     return;
//   }
  
//   // Create rows for each aggregated product
//   overviewData.forEach((item, index) => {
//     const row = document.createElement('tr');
//     const stockLevel = getStockLevel(item.quantity);
    
//     row.innerHTML = `
//       <td>${item.productName}</td>
//       <td>${item.productType}</td>
//       <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
//       <td class="${stockLevel.class}">${stockLevel.text}</td>
//     `;
    
//     // Add smooth fade-in animation
//     row.style.animation = `fadeIn 0.3s ease-in ${index * 0.05}s both`;
    
//     overviewTableBody.appendChild(row);
//   });
  
//   // Add CSS animation if not already present
//   if (!document.getElementById('overview-animations')) {
//     const style = document.createElement('style');
//     style.id = 'overview-animations';
//     style.textContent = `
//       @keyframes fadeIn {
//         from {
//           opacity: 0;
//           transform: translateY(-10px);
//         }
//         to {
//           opacity: 1;
//           transform: translateY(0);
//         }
//       }
//     `;
//     document.head.appendChild(style);
//   }
  
//   console.log(`Stock Overview: Generated ${overviewData.length} unique product(s)`);
// }

// /**
//  * Determine stock level based on quantity
//  * @param {number} quantity - Total quantity of stock
//  * @returns {Object} Stock level object with text and CSS class
//  */
// function getStockLevel(quantity) {
//   if (quantity > 50) {
//     return {
//       text: 'Plenty in Stock',
//       class: 'stock-plenty'
//     };
//   } else if (quantity > 20) {
//     return {
//       text: 'Restock Soon',
//       class: 'stock-restock-soon'
//     };
//   } else {
//     return {
//       text: 'Restock Now',
//       class: 'stock-restock-now'
//     };
//   }
// }

// /**
//  * Observe changes to the stock table for real-time updates
//  * Uses MutationObserver to detect DOM changes
//  */
// function observeStockTableChanges() {
//   const stockTableBody = document.querySelector('#stockTable tbody');
  
//   if (!stockTableBody) {
//     console.warn('Stock Overview: Cannot observe - stock table body not found');
//     return;
//   }
  
//   // Create a mutation observer
//   const observer = new MutationObserver(function(mutations) {
//     // Check if there are actual changes to process
//     let shouldUpdate = false;
    
//     mutations.forEach(mutation => {
//       if (mutation.type === 'childList' || mutation.type === 'characterData') {
//         shouldUpdate = true;
//       }
//     });
    
//     if (shouldUpdate) {
//       // Debounce the update to avoid excessive recalculations
//       clearTimeout(window.stockOverviewTimeout);
//       window.stockOverviewTimeout = setTimeout(() => {
//         console.log('Stock Overview: Table changed, regenerating overview...');
//         generateStockOverview();
//       }, 500);
//     }
//   });
  
//   // Observe changes to the stock table
//   observer.observe(stockTableBody, {
//     childList: true,      // Watch for added/removed rows
//     subtree: true,        // Watch all descendants
//     characterData: true,  // Watch for text changes
//     attributes: false     // Don't watch attribute changes
//   });
  
//   console.log('Stock Overview: Monitoring stock table for changes');
// }

// /**
//  * Refresh overview manually
//  * Can be called from UI button with visual feedback
//  */
// function refreshStockOverview() {
//   console.log('Stock Overview: Manual refresh triggered');
  
//   const btn = event ? event.target : null;
  
//   // Visual feedback on button
//   if (btn) {
//     const originalText = btn.innerHTML;
//     const originalBg = btn.style.backgroundColor;
    
//     btn.innerHTML = '⟳ Refreshing...';
//     btn.disabled = true;
//     btn.style.backgroundColor = '#6c757d';
//   }
  
//   // Regenerate overview
//   generateStockOverview();
  
//   // Reset button after short delay
//   if (btn) {
//     setTimeout(() => {
//       btn.innerHTML = '✓ Refreshed!';
//       btn.style.backgroundColor = '#28a745';
      
//       setTimeout(() => {
//         btn.innerHTML = '🔄 Refresh';
//         btn.style.backgroundColor = '';
//         btn.disabled = false;
//       }, 1500);
//     }, 300);
//   }
// }

// /**
//  * Get overview statistics
//  * @returns {Object} Statistics about current stock overview
//  */
// function getOverviewStats() {
//   const overviewTable = document.getElementById('overviewTable');
//   const rows = overviewTable.querySelectorAll('tbody tr');
  
//   let stats = {
//     totalProducts: 0,
//     totalQuantity: 0,
//     plentyInStock: 0,
//     restockSoon: 0,
//     restockNow: 0
//   };
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       stats.totalProducts++;
      
//       const quantity = parseFloat(cells[2].textContent) || 0;
//       stats.totalQuantity += quantity;
      
//       const stockLevel = cells[3].textContent.trim();
//       if (stockLevel === 'Plenty in Stock') {
//         stats.plentyInStock++;
//       } else if (stockLevel === 'Restock Soon') {
//         stats.restockSoon++;
//       } else if (stockLevel === 'Restock Now') {
//         stats.restockNow++;
//       }
//     }
//   });
  
//   return stats;
// }

// /**
//  * Export overview data as JSON
//  * @returns {Array} Array of overview items
//  */
// function exportOverviewData() {
//   const overviewTable = document.getElementById('overviewTable');
//   const rows = overviewTable.querySelectorAll('tbody tr');
//   const data = [];
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       data.push({
//         productName: cells[0].textContent.trim(),
//         productType: cells[1].textContent.trim(),
//         totalQuantity: parseFloat(cells[2].textContent) || 0,
//         stockLevel: cells[3].textContent.trim()
//       });
//     }
//   });
  
//   return data;
// }

// /**
//  * Filter overview table by stock level
//  * @param {string} level - 'all', 'plenty', 'restock-soon', or 'restock-now'
//  */
// function filterOverviewByLevel(level) {
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
//   const rows = overviewTableBody.querySelectorAll('tr');
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       const stockLevelCell = cells[3];
//       const stockLevel = stockLevelCell.textContent.trim();
      
//       let shouldShow = false;
      
//       if (level === 'all') {
//         shouldShow = true;
//       } else if (level === 'plenty' && stockLevel === 'Plenty in Stock') {
//         shouldShow = true;
//       } else if (level === 'restock-soon' && stockLevel === 'Restock Soon') {
//         shouldShow = true;
//       } else if (level === 'restock-now' && stockLevel === 'Restock Now') {
//         shouldShow = true;
//       }
      
//       row.style.display = shouldShow ? '' : 'none';
//     }
//   });
  
//   console.log(`Stock Overview: Filtered by level - ${level}`);
// }

// /**
//  * Search/filter overview table by product name or type
//  * @param {string} searchTerm - Search term to filter by
//  */
// function searchOverview(searchTerm) {
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
//   const rows = overviewTableBody.querySelectorAll('tr');
//   const term = searchTerm.toLowerCase().trim();
  
//   if (!term) {
//     // Show all rows if search is empty
//     rows.forEach(row => {
//       row.style.display = '';
//     });
//     return;
//   }
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       const productName = cells[0].textContent.toLowerCase();
//       const productType = cells[1].textContent.toLowerCase();
      
//       const matches = productName.includes(term) || productType.includes(term);
//       row.style.display = matches ? '' : 'none';
//     }
//   });
  
//   console.log(`Stock Overview: Searched for "${searchTerm}"`);
// }

// // Export functions for use in other scripts if needed
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = {
//     generateStockOverview,
//     refreshStockOverview,
//     getOverviewStats,
//     exportOverviewData,
//     filterOverviewByLevel,
//     searchOverview
//   };
// }

// console.log('Stock Overview Script: Loaded successfully');




/**
 * Stock Overview - Real-time aggregation from Stock List table
 * Automatically updates the overview table based on the main stock list
 * File: /public/js/stockoverview.js
 */

// Initialize when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//   console.log('Stock Overview: Initializing...');
  
//   // Wait a bit for the DOM to fully settle
//   setTimeout(function() {
//     generateStockOverview();
//     observeStockTableChanges();
//   }, 100);
  
//   console.log('Stock Overview: Initialized successfully');
// });

// /**
//  * Main function to generate stock overview from the stock list table
//  * Aggregates items by Product Name and Type
//  */
// function generateStockOverview() {
//   const stockTable = document.getElementById('stockTable');
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
  
//   if (!stockTable) {
//     console.warn('Stock Overview: Stock table not found');
//     return;
//   }
  
//   if (!overviewTableBody) {
//     console.warn('Stock Overview: Overview table body not found');
//     return;
//   }
  
//   // Get all stock rows
//   const stockRows = stockTable.querySelectorAll('tbody tr');
//   const stockData = {};
  
//   // Process each row
//   stockRows.forEach(row => {
//     const cells = row.querySelectorAll('td');
    
//     // Skip empty or incomplete rows
//     if (cells.length < 3) return;
    
//     const productName = cells[0].textContent.trim();
//     const productType = cells[1].textContent.trim();
//     const totalQtyText = cells[2].textContent.trim();
//     const totalQty = parseFloat(totalQtyText) || 0;
    
//     // Skip invalid entries
//     if (productName === '-' || productName === '' || productName.toLowerCase().includes('no stock') || totalQty === 0) {
//       return;
//     }
    
//     // Create unique key for grouping (Product Name + Type)
//     const key = `${productName}|||${productType}`;
    
//     // Aggregate quantities
//     if (stockData[key]) {
//       stockData[key].quantity += totalQty;
//     } else {
//       stockData[key] = {
//         productName: productName,
//         productType: productType,
//         quantity: totalQty
//       };
//     }
//   });
  
//   // Convert to array and sort alphabetically
//   const overviewData = Object.values(stockData).sort((a, b) => {
//     // Sort by product name first
//     if (a.productName.toLowerCase() < b.productName.toLowerCase()) return -1;
//     if (a.productName.toLowerCase() > b.productName.toLowerCase()) return 1;
//     // Then by product type
//     if (a.productType.toLowerCase() < b.productType.toLowerCase()) return -1;
//     if (a.productType.toLowerCase() > b.productType.toLowerCase()) return 1;
//     return 0;
//   });
  
//   // Clear existing overview
//   overviewTableBody.innerHTML = '';
  
//   // Populate overview table
//   if (overviewData.length === 0) {
//     overviewTableBody.innerHTML = `
//       <tr>
//         <td colspan="4" style="text-align:center; color: gray; padding: 30px;">
//           No stock data available for overview
//         </td>
//       </tr>
//     `;
//     console.log('Stock Overview: No data available');
//     return;
//   }
  
//   // Create rows for each aggregated product
//   overviewData.forEach((item, index) => {
//     const row = document.createElement('tr');
//     const stockLevel = getStockLevel(item.quantity);
    
//     row.innerHTML = `
//       <td>${item.productName}</td>
//       <td>${item.productType}</td>
//       <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
//       <td class="${stockLevel.class}">${stockLevel.text}</td>
//     `;
    
//     // Add smooth fade-in animation
//     row.style.animation = `fadeIn 0.3s ease-in ${index * 0.05}s both`;
    
//     overviewTableBody.appendChild(row);
//   });
  
//   // Add CSS animation if not already present
//   if (!document.getElementById('overview-animations')) {
//     const style = document.createElement('style');
//     style.id = 'overview-animations';
//     style.textContent = `
//       @keyframes fadeIn {
//         from {
//           opacity: 0;
//           transform: translateY(-10px);
//         }
//         to {
//           opacity: 1;
//           transform: translateY(0);
//         }
//       }
//     `;
//     document.head.appendChild(style);
//   }
  
//   console.log(`Stock Overview: Generated ${overviewData.length} unique product(s)`);
// }

// /**
//  * Determine stock level based on quantity
//  * @param {number} quantity - Total quantity of stock
//  * @returns {Object} Stock level object with text and CSS class
//  */
// function getStockLevel(quantity) {
//   if (quantity > 50) {
//     return {
//       text: 'Plenty in Stock',
//       class: 'stock-plenty'
//     };
//   } else if (quantity > 20) {
//     return {
//       text: 'Restock Soon',
//       class: 'stock-restock-soon'
//     };
//   } else {
//     return {
//       text: 'Restock Now',
//       class: 'stock-restock-now'
//     };
//   }
// }

// /**
//  * Observe changes to the stock table for real-time updates
//  * Uses MutationObserver to detect DOM changes
//  */
// function observeStockTableChanges() {
//   const stockTableBody = document.querySelector('#stockTable tbody');
  
//   if (!stockTableBody) {
//     console.warn('Stock Overview: Cannot observe - stock table body not found');
//     return;
//   }
  
//   // Create a mutation observer
//   const observer = new MutationObserver(function(mutations) {
//     // Check if there are actual changes to process
//     let shouldUpdate = false;
    
//     mutations.forEach(mutation => {
//       if (mutation.type === 'childList' || mutation.type === 'characterData') {
//         shouldUpdate = true;
//       }
//     });
    
//     if (shouldUpdate) {
//       // Debounce the update to avoid excessive recalculations
//       clearTimeout(window.stockOverviewTimeout);
//       window.stockOverviewTimeout = setTimeout(() => {
//         console.log('Stock Overview: Table changed, regenerating overview...');
//         generateStockOverview();
//       }, 500);
//     }
//   });
  
//   // Observe changes to the stock table
//   observer.observe(stockTableBody, {
//     childList: true,      // Watch for added/removed rows
//     subtree: true,        // Watch all descendants
//     characterData: true,  // Watch for text changes
//     attributes: false     // Don't watch attribute changes
//   });
  
//   console.log('Stock Overview: Monitoring stock table for changes');
// }

// /**
//  * Refresh overview manually
//  * Can be called from UI button with visual feedback
//  */
// function refreshStockOverview() {
//   console.log('Stock Overview: Manual refresh triggered');
  
//   const btn = event ? event.target : null;
  
//   // Visual feedback on button
//   if (btn) {
//     const originalText = btn.innerHTML;
//     const originalBg = btn.style.backgroundColor;
    
//     btn.innerHTML = '⟳ Refreshing...';
//     btn.disabled = true;
//     btn.style.backgroundColor = '#6c757d';
//   }
  
//   // Regenerate overview
//   generateStockOverview();
  
//   // Reset button after short delay
//   if (btn) {
//     setTimeout(() => {
//       btn.innerHTML = '✓ Refreshed!';
//       btn.style.backgroundColor = '#28a745';
      
//       setTimeout(() => {
//         btn.innerHTML = '🔄 Refresh';
//         btn.style.backgroundColor = '';
//         btn.disabled = false;
//       }, 1500);
//     }, 300);
//   }
// }

// /**
//  * Get overview statistics
//  * @returns {Object} Statistics about current stock overview
//  */
// function getOverviewStats() {
//   const overviewTable = document.getElementById('overviewTable');
//   const rows = overviewTable.querySelectorAll('tbody tr');
  
//   let stats = {
//     totalProducts: 0,
//     totalQuantity: 0,
//     plentyInStock: 0,
//     restockSoon: 0,
//     restockNow: 0
//   };
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       stats.totalProducts++;
      
//       const quantity = parseFloat(cells[2].textContent) || 0;
//       stats.totalQuantity += quantity;
      
//       const stockLevel = cells[3].textContent.trim();
//       if (stockLevel === 'Plenty in Stock') {
//         stats.plentyInStock++;
//       } else if (stockLevel === 'Restock Soon') {
//         stats.restockSoon++;
//       } else if (stockLevel === 'Restock Now') {
//         stats.restockNow++;
//       }
//     }
//   });
  
//   return stats;
// }

// /**
//  * Export overview data as JSON
//  * @returns {Array} Array of overview items
//  */
// function exportOverviewData() {
//   const overviewTable = document.getElementById('overviewTable');
//   const rows = overviewTable.querySelectorAll('tbody tr');
//   const data = [];
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       data.push({
//         productName: cells[0].textContent.trim(),
//         productType: cells[1].textContent.trim(),
//         totalQuantity: parseFloat(cells[2].textContent) || 0,
//         stockLevel: cells[3].textContent.trim()
//       });
//     }
//   });
  
//   return data;
// }

// /**
//  * Filter overview table by stock level
//  * @param {string} level - 'all', 'plenty', 'restock-soon', or 'restock-now'
//  */
// function filterOverviewByLevel(level) {
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
//   const rows = overviewTableBody.querySelectorAll('tr');
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       const stockLevelCell = cells[3];
//       const stockLevel = stockLevelCell.textContent.trim();
      
//       let shouldShow = false;
      
//       if (level === 'all') {
//         shouldShow = true;
//       } else if (level === 'plenty' && stockLevel === 'Plenty in Stock') {
//         shouldShow = true;
//       } else if (level === 'restock-soon' && stockLevel === 'Restock Soon') {
//         shouldShow = true;
//       } else if (level === 'restock-now' && stockLevel === 'Restock Now') {
//         shouldShow = true;
//       }
      
//       row.style.display = shouldShow ? '' : 'none';
//     }
//   });
  
//   console.log(`Stock Overview: Filtered by level - ${level}`);
// }

// /**
//  * Search/filter overview table by product name or type
//  * @param {string} searchTerm - Search term to filter by
//  */
// function searchOverview(searchTerm) {
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
//   const rows = overviewTableBody.querySelectorAll('tr');
//   const term = searchTerm.toLowerCase().trim();
  
//   if (!term) {
//     // Show all rows if search is empty
//     rows.forEach(row => {
//       row.style.display = '';
//     });
//     return;
//   }
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       const productName = cells[0].textContent.toLowerCase();
//       const productType = cells[1].textContent.toLowerCase();
      
//       const matches = productName.includes(term) || productType.includes(term);
//       row.style.display = matches ? '' : 'none';
//     }
//   });
  
//   console.log(`Stock Overview: Searched for "${searchTerm}"`);
// }

// // Export functions for use in other scripts if needed
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = {
//     generateStockOverview,
//     refreshStockOverview,
//     getOverviewStats,
//     exportOverviewData,
//     filterOverviewByLevel,
//     searchOverview
//   };
// }

// console.log('Stock Overview Script: Loaded successfully');




/**
 * Stock Overview - Real-time aggregation from Stock List table
 * File: /public/js/stockoverview.js
 */

// console.log('=== Stock Overview Script Loading ===');

// // Initialize when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//   console.log('Stock Overview: DOM Content Loaded');
//   console.log('Stock Overview: Initializing in 100ms...');
  
//   // Wait a bit for the DOM to fully settle
//   setTimeout(function() {
//     console.log('Stock Overview: Starting initialization...');
//     generateStockOverview();
//     observeStockTableChanges();
//     console.log('Stock Overview: Initialization complete');
//   }, 100);
// });

// /**
//  * Main function to generate stock overview from the stock list table
//  */
// function generateStockOverview() {
//   console.log('\n=== Generate Stock Overview Called ===');
  
//   const stockTable = document.getElementById('stockTable');
//   const overviewTableBody = document.querySelector('#overviewTable tbody');
  
//   console.log('Stock Table found:', !!stockTable);
//   console.log('Overview Table Body found:', !!overviewTableBody);
  
//   if (!stockTable) {
//     console.error('❌ Stock table NOT found! Looking for #stockTable');
//     const allTables = document.querySelectorAll('table');
//     console.log('All tables on page:', allTables.length);
//     allTables.forEach((table, i) => {
//       console.log(`  Table ${i}:`, table.id || 'no id', table.className || 'no class');
//     });
//     return;
//   }
  
//   if (!overviewTableBody) {
//     console.error('❌ Overview table body NOT found!');
//     return;
//   }
  
//   // Get all stock rows
//   const stockRows = stockTable.querySelectorAll('tbody tr');
//   console.log(`📊 Found ${stockRows.length} rows in stock table`);
  
//   if (stockRows.length === 0) {
//     console.warn('⚠️ No rows in stock table tbody');
//     overviewTableBody.innerHTML = `
//       <tr>
//         <td colspan="4" style="text-align:center; color: gray; padding: 30px;">
//           No stock data available for overview
//         </td>
//       </tr>
//     `;
//     return;
//   }
  
//   const stockData = {};
//   let processedCount = 0;
//   let skippedCount = 0;
  
//   // Process each row
//   stockRows.forEach((row, rowIndex) => {
//     const cells = row.querySelectorAll('td');
    
//     // Skip empty or incomplete rows
//     if (cells.length < 3) {
//       console.log(`  Row ${rowIndex}: SKIPPED - only ${cells.length} cells`);
//       skippedCount++;
//       return;
//     }
    
//     const productName = cells[0].textContent.trim();
//     const productType = cells[1].textContent.trim();
//     const totalQtyText = cells[2].textContent.trim();
//     const totalQty = parseFloat(totalQtyText);
    
//     console.log(`  Row ${rowIndex}:`, {
//       productName,
//       productType,
//       totalQtyText,
//       totalQty
//     });
    
//     // Skip invalid entries
//     if (productName === '-' || 
//         productName === '' || 
//         productName.toLowerCase().includes('no stock') ||
//         isNaN(totalQty) ||
//         totalQty === 0) {
//       console.log(`    ⏭️ SKIPPED - Invalid data`);
//       skippedCount++;
//       return;
//     }
    
//     // Create unique key for grouping
//     const key = `${productName}|||${productType}`;
    
//     // Aggregate quantities
//     if (stockData[key]) {
//       stockData[key].quantity += totalQty;
//       console.log(`    ➕ Added to existing (new total: ${stockData[key].quantity})`);
//     } else {
//       stockData[key] = {
//         productName: productName,
//         productType: productType,
//         quantity: totalQty
//       };
//       console.log(`    ✅ Created new entry`);
//     }
//     processedCount++;
//   });
  
//   console.log(`\n📈 Processing Summary:`);
//   console.log(`  - Total rows: ${stockRows.length}`);
//   console.log(`  - Processed: ${processedCount}`);
//   console.log(`  - Skipped: ${skippedCount}`);
//   console.log(`  - Unique products: ${Object.keys(stockData).length}`);
  
//   // Convert to array and sort
//   const overviewData = Object.values(stockData).sort((a, b) => {
//     if (a.productName.toLowerCase() < b.productName.toLowerCase()) return -1;
//     if (a.productName.toLowerCase() > b.productName.toLowerCase()) return 1;
//     if (a.productType.toLowerCase() < b.productType.toLowerCase()) return -1;
//     if (a.productType.toLowerCase() > b.productType.toLowerCase()) return 1;
//     return 0;
//   });
  
//   console.log('\n📋 Aggregated Data:', overviewData);
  
//   // Clear existing overview
//   overviewTableBody.innerHTML = '';
  
//   // Populate overview table
//   if (overviewData.length === 0) {
//     overviewTableBody.innerHTML = `
//       <tr>
//         <td colspan="4" style="text-align:center; color: gray; padding: 30px;">
//           No valid stock data available for overview
//         </td>
//       </tr>
//     `;
//     console.log('⚠️ No data to display');
//     return;
//   }
  
//   // Create rows
//   overviewData.forEach((item, index) => {
//     const row = document.createElement('tr');
//     const stockLevel = getStockLevel(item.quantity);
    
//     row.innerHTML = `
//       <td>${item.productName}</td>
//       <td>${item.productType}</td>
//       <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
//       <td class="${stockLevel.class}">${stockLevel.text}</td>
//     `;
    
//     row.style.animation = `fadeIn 0.3s ease-in ${index * 0.05}s both`;
//     overviewTableBody.appendChild(row);
    
//     console.log(`  ✅ Row ${index + 1}: ${item.productName} (${item.quantity}) - ${stockLevel.text}`);
//   });
  
//   // Add animation CSS
//   if (!document.getElementById('overview-animations')) {
//     const style = document.createElement('style');
//     style.id = 'overview-animations';
//     style.textContent = `
//       @keyframes fadeIn {
//         from { opacity: 0; transform: translateY(-10px); }
//         to { opacity: 1; transform: translateY(0); }
//       }
//     `;
//     document.head.appendChild(style);
//   }
  
//   console.log(`\n✅ Successfully generated ${overviewData.length} unique product(s)\n`);
// }

// /**
//  * Determine stock level based on quantity
//  */
// function getStockLevel(quantity) {
//   if (quantity > 50) {
//     return { text: 'Plenty in Stock', class: 'stock-plenty' };
//   } else if (quantity > 20) {
//     return { text: 'Restock Soon', class: 'stock-restock-soon' };
//   } else {
//     return { text: 'Restock Now', class: 'stock-restock-now' };
//   }
// }

// /**
//  * Observe changes to stock table
//  */
// function observeStockTableChanges() {
//   const stockTableBody = document.querySelector('#stockTable tbody');
  
//   if (!stockTableBody) {
//     console.warn('⚠️ Cannot observe - stock table body not found');
//     return;
//   }
  
//   const observer = new MutationObserver(function(mutations) {
//     let shouldUpdate = false;
    
//     mutations.forEach(mutation => {
//       if (mutation.type === 'childList' || mutation.type === 'characterData') {
//         shouldUpdate = true;
//       }
//     });
    
//     if (shouldUpdate) {
//       clearTimeout(window.stockOverviewTimeout);
//       window.stockOverviewTimeout = setTimeout(() => {
//         console.log('🔄 Stock table changed - regenerating overview...');
//         generateStockOverview();
//       }, 500);
//     }
//   });
  
//   observer.observe(stockTableBody, {
//     childList: true,
//     subtree: true,
//     characterData: true,
//     attributes: false
//   });
  
//   console.log('👁️ Monitoring stock table for changes');
// }

// /**
//  * Manual refresh with button feedback
//  */
// function refreshStockOverview() {
//   console.log('🔄 Manual refresh triggered');
  
//   const btn = event ? event.target : null;
  
//   if (btn) {
//     btn.innerHTML = '⟳ Refreshing...';
//     btn.disabled = true;
//     btn.style.backgroundColor = '#6c757d';
//   }
  
//   generateStockOverview();
  
//   if (btn) {
//     setTimeout(() => {
//       btn.innerHTML = '✓ Refreshed!';
//       btn.style.backgroundColor = '#28a745';
      
//       setTimeout(() => {
//         btn.innerHTML = '🔄 Refresh';
//         btn.style.backgroundColor = '';
//         btn.disabled = false;
//       }, 1500);
//     }, 300);
//   }
// }

// /**
//  * Get overview statistics
//  */
// function getOverviewStats() {
//   const overviewTable = document.getElementById('overviewTable');
//   const rows = overviewTable.querySelectorAll('tbody tr');
  
//   let stats = {
//     totalProducts: 0,
//     totalQuantity: 0,
//     plentyInStock: 0,
//     restockSoon: 0,
//     restockNow: 0
//   };
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       stats.totalProducts++;
      
//       const quantity = parseFloat(cells[2].textContent) || 0;
//       stats.totalQuantity += quantity;
      
//       const stockLevel = cells[3].textContent.trim();
//       if (stockLevel === 'Plenty in Stock') stats.plentyInStock++;
//       else if (stockLevel === 'Restock Soon') stats.restockSoon++;
//       else if (stockLevel === 'Restock Now') stats.restockNow++;
//     }
//   });
  
//   return stats;
// }

// /**
//  * Export overview data
//  */
// function exportOverviewData() {
//   const overviewTable = document.getElementById('overviewTable');
//   const rows = overviewTable.querySelectorAll('tbody tr');
//   const data = [];
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       data.push({
//         productName: cells[0].textContent.trim(),
//         productType: cells[1].textContent.trim(),
//         totalQuantity: parseFloat(cells[2].textContent) || 0,
//         stockLevel: cells[3].textContent.trim()
//       });
//     }
//   });
  
//   return data;
// }

// /**
//  * Filter by stock level
//  */
// function filterOverviewByLevel(level) {
//   const rows = document.querySelectorAll('#overviewTable tbody tr');
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       const stockLevel = cells[3].textContent.trim();
//       let shouldShow = false;
      
//       if (level === 'all') shouldShow = true;
//       else if (level === 'plenty' && stockLevel === 'Plenty in Stock') shouldShow = true;
//       else if (level === 'restock-soon' && stockLevel === 'Restock Soon') shouldShow = true;
//       else if (level === 'restock-now' && stockLevel === 'Restock Now') shouldShow = true;
      
//       row.style.display = shouldShow ? '' : 'none';
//     }
//   });
  
//   console.log(`🔍 Filtered by: ${level}`);
// }

// /**
//  * Search overview
//  */
// function searchOverview(searchTerm) {
//   const rows = document.querySelectorAll('#overviewTable tbody tr');
//   const term = searchTerm.toLowerCase().trim();
  
//   if (!term) {
//     rows.forEach(row => row.style.display = '');
//     return;
//   }
  
//   rows.forEach(row => {
//     const cells = row.querySelectorAll('td');
//     if (cells.length === 4) {
//       const productName = cells[0].textContent.toLowerCase();
//       const productType = cells[1].textContent.toLowerCase();
//       const matches = productName.includes(term) || productType.includes(term);
//       row.style.display = matches ? '' : 'none';
//     }
//   });
  
//   console.log(`🔍 Searched for: "${searchTerm}"`);
// }

// console.log('✅ Stock Overview Script Loaded Successfully');



/**
 * Stock Overview - Real-time aggregation from Stock List table
 * File: /public/js/stockoverview.js
 */

(function() {
  'use strict';
  
  console.log('Stock Overview Script: Loading...');

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Stock Overview: Initializing...');
    
    try {
      setTimeout(function() {
        generateStockOverview();
        observeStockTableChanges();
        console.log('Stock Overview: Initialization complete');
      }, 200);
    } catch (error) {
      console.error('Stock Overview Init Error:', error);
    }
  }

  /**
   * Generate stock overview from stock list table
   */
  function generateStockOverview() {
    try {
      console.log('Stock Overview: Starting generation...');
      
      const stockTable = document.getElementById('stockTable');
      const overviewTableBody = document.querySelector('#overviewTable tbody');
      
      if (!stockTable) {
        console.error('Stock table not found!');
        return;
      }
      
      if (!overviewTableBody) {
        console.error('Overview table body not found!');
        return;
      }
      
      const stockRows = stockTable.querySelectorAll('tbody tr');
      console.log(`Found ${stockRows.length} stock rows`);
      
      if (stockRows.length === 0) {
        overviewTableBody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align:center; color: gray; padding: 30px;">
              No stock data available
            </td>
          </tr>
        `;
        return;
      }
      
      const stockData = {};
      let validCount = 0;
      
      stockRows.forEach(function(row, index) {
        try {
          const cells = row.querySelectorAll('td');
          
          if (cells.length < 3) return;
          
          const productName = cells[0].textContent.trim();
          const productType = cells[1].textContent.trim();
          const qtyText = cells[2].textContent.trim();
          const qty = parseFloat(qtyText);
          
          console.log(`Row ${index}: ${productName} | ${productType} | ${qtyText}`);
          
          if (!productName || productName === '-' || isNaN(qty) || qty === 0) {
            console.log(`  Skipped - invalid data`);
            return;
          }
          
          const key = productName + '|||' + productType;
          
          if (stockData[key]) {
            stockData[key].quantity += qty;
          } else {
            stockData[key] = {
              productName: productName,
              productType: productType,
              quantity: qty
            };
          }
          
          validCount++;
        } catch (error) {
          console.error('Error processing row:', error);
        }
      });
      
      console.log(`Processed ${validCount} valid rows`);
      
      const overviewData = Object.values(stockData).sort(function(a, b) {
        const nameA = a.productName.toLowerCase();
        const nameB = b.productName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        
        const typeA = a.productType.toLowerCase();
        const typeB = b.productType.toLowerCase();
        if (typeA < typeB) return -1;
        if (typeA > typeB) return 1;
        
        return 0;
      });
      
      console.log(`Created ${overviewData.length} unique products`);
      
      overviewTableBody.innerHTML = '';
      
      if (overviewData.length === 0) {
        overviewTableBody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align:center; color: gray; padding: 30px;">
              No valid stock data
            </td>
          </tr>
        `;
        return;
      }
      
      overviewData.forEach(function(item, index) {
        const row = document.createElement('tr');
        const level = getStockLevel(item.quantity);
        
        row.innerHTML = 
          '<td>' + item.productName + '</td>' +
          '<td>' + item.productType + '</td>' +
          '<td style="text-align: center; font-weight: bold;">' + item.quantity + '</td>' +
          '<td class="' + level.class + '">' + level.text + '</td>';
        
        overviewTableBody.appendChild(row);
        console.log(`Added: ${item.productName} (${item.quantity}) - ${level.text}`);
      });
      
      console.log('Stock Overview: Generation complete!');
      
    } catch (error) {
      console.error('Generate Overview Error:', error);
    }
  }

  /**
   * Get stock level based on quantity
   */
  function getStockLevel(quantity) {
    if (quantity > 50) {
      return { text: 'Plenty in Stock', class: 'stock-plenty' };
    } else if (quantity > 20) {
      return { text: 'Restock Soon', class: 'stock-restock-soon' };
    } else {
      return { text: 'Restock Now', class: 'stock-restock-now' };
    }
  }

  /**
   * Observe stock table changes
   */
  function observeStockTableChanges() {
    try {
      const stockTableBody = document.querySelector('#stockTable tbody');
      
      if (!stockTableBody) {
        console.warn('Cannot observe - stock tbody not found');
        return;
      }
      
      const observer = new MutationObserver(function(mutations) {
        clearTimeout(window.stockOverviewTimeout);
        window.stockOverviewTimeout = setTimeout(function() {
          console.log('Table changed - regenerating...');
          generateStockOverview();
        }, 500);
      });
      
      observer.observe(stockTableBody, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      console.log('Monitoring stock table');
      
    } catch (error) {
      console.error('Observer Error:', error);
    }
  }

  /**
   * Manual refresh function
   */
  window.refreshStockOverview = function() {
    try {
      console.log('Manual refresh triggered');
      
      const btn = window.event ? window.event.target : null;
      
      if (btn) {
        btn.innerHTML = '⟳ Refreshing...';
        btn.disabled = true;
      }
      
      generateStockOverview();
      
      if (btn) {
        setTimeout(function() {
          btn.innerHTML = '✓ Refreshed!';
          setTimeout(function() {
            btn.innerHTML = '🔄 Refresh';
            btn.disabled = false;
          }, 1000);
        }, 300);
      }
    } catch (error) {
      console.error('Refresh Error:', error);
    }
  };

  console.log('Stock Overview Script: Loaded');

})();