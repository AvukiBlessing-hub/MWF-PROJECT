
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