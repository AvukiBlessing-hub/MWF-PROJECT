// document.addEventListener('DOMContentLoaded', function() {
//   const productSelect = document.getElementById('stockId');
//   if (!productSelect) return;

//   fetch('/api/stockoverview')
//     .then(response => response.json())
//     .then(data => {
//       productSelect.innerHTML = '<option value="">-- Select Product --</option>';

//       data.forEach(item => {
//         const productName = item._id.productName;
//         const productType = item._id.productType;
//         const quantity = item.totalAvailable;

//         const option = document.createElement('option');
//         option.value = productName + '|||' + productType; // or use unique id if you prefer
//         option.textContent = `${productName} (${productType}) - Available: ${quantity}`;
//         productSelect.appendChild(option);
//       });

//       if (data.length === 0) {
//         productSelect.innerHTML = '<option value="">No stock available</option>';
//       }
//     })
//     .catch(err => {
//       console.error('Error loading stock overview:', err);
//       productSelect.innerHTML = '<option value="">Unable to load products</option>';
//     });
// });




(function() {
  'use strict';
  
  console.log('Sales Script: Loading...');

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Sales: Initializing...');
    
    try {
      loadStockOverview();
      setupQuantityValidation();
      setupProductTypeFilter();
      console.log('Sales: Initialization complete');
    } catch (error) {
      console.error('Sales Init Error:', error);
    }
  }

  /**
   * Load stock overview data from the stocklist page
   */
  function loadStockOverview() {
    const productSelect = document.getElementById('stockId');
    
    if (!productSelect) {
      console.error('Product select not found!');
      return;
    }

    // Fetch stock items from backend
    fetch('/api/stocklist')
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        return response.json();
      })
      .then(function(stockItems) {
        console.log('Received stock items:', stockItems.length);
        
        // Generate stock overview using same logic as stockoverview.js
        const overviewData = generateStockOverviewData(stockItems);
        console.log('Generated overview data:', overviewData.length);
        
        // Store for filtering
        window.stockOverviewData = overviewData;
        
        // Populate dropdown
        populateProductDropdown(overviewData);
      })
      .catch(function(err) {
        console.error('Error loading stock data:', err);
        productSelect.innerHTML = '<option value="">Unable to load products</option>';
      });
  }

  /**
   * Generate stock overview from raw stock items
   * Same logic as stockoverview.js
   */
  function generateStockOverviewData(stockItems) {
    const stockData = {};
    
    stockItems.forEach(function(item) {
      const productName = item.productName;
      const productType = item.productType;
      const quantity = Number(item.totalQuantity) || 0;
      
      // Skip invalid entries
      if (!productName || productName === '-' || quantity === 0) {
        return;
      }
      
      const key = productName + '|||' + productType;
      
      if (stockData[key]) {
        stockData[key].quantity += quantity;
      } else {
        stockData[key] = {
          productName: productName,
          productType: productType,
          quantity: quantity
        };
      }
    });
    
    // Convert to array and sort
    const overviewArray = Object.values(stockData).sort(function(a, b) {
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
    
    return overviewArray;
  }

  /**
   * Populate product dropdown with overview data
   */
  function populateProductDropdown(overviewData, filterType) {
    const productSelect = document.getElementById('stockId');
    
    if (!productSelect) return;
    
    productSelect.innerHTML = '<option value="">-- Select Product --</option>';
    
    let filteredData = overviewData;
    
    // Filter by type if specified
    if (filterType && filterType !== '') {
      filteredData = overviewData.filter(function(item) {
        return item.productType.toLowerCase() === filterType.toLowerCase();
      });
    }
    
    if (filteredData.length === 0) {
      productSelect.innerHTML = '<option value="">No stock available</option>';
      return;
    }
    
    filteredData.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item.productName + '|||' + item.productType;
      option.setAttribute('data-quantity', item.quantity);
      option.setAttribute('data-product-name', item.productName);
      option.setAttribute('data-product-type', item.productType);
      
      // Get stock level indicator
      const stockLevel = getStockLevelIndicator(item.quantity);
      
      option.textContent = item.productName + ' (' + item.productType + ') - Available: ' + item.quantity + ' ' + stockLevel;
      productSelect.appendChild(option);
    });
    
    console.log('Populated ' + filteredData.length + ' products');
  }

  /**
   * Get stock level indicator
   */
  function getStockLevelIndicator(quantity) {
    if (quantity > 50) {
      return '✓'; // Plenty
    } else if (quantity > 20) {
      return '⚠️'; // Restock Soon
    } else {
      return '🔴'; // Restock Now
    }
  }

  /**
   * Setup product type filter
   */
  function setupProductTypeFilter() {
    const productTypeSelect = document.getElementById('productType');
    
    if (!productTypeSelect) return;
    
    productTypeSelect.addEventListener('change', function() {
      const selectedType = this.value;
      console.log('Filter by type:', selectedType);
      
      if (window.stockOverviewData) {
        populateProductDropdown(window.stockOverviewData, selectedType);
      }
    });
  }

  /**
   * Setup quantity validation
   */
  function setupQuantityValidation() {
    const quantityInput = document.getElementById('quantity');
    const productSelect = document.getElementById('stockId');
    
    if (!quantityInput || !productSelect) return;
    
    quantityInput.addEventListener('input', function() {
      validateQuantity();
    });
    
    productSelect.addEventListener('change', function() {
      // Reset quantity validation when product changes
      quantityInput.value = '';
      quantityInput.setCustomValidity('');
    });
  }

  /**
   * Validate quantity against available stock
   */
  function validateQuantity() {
    const quantityInput = document.getElementById('quantity');
    const productSelect = document.getElementById('stockId');
    
    if (!quantityInput || !productSelect) return;
    
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    
    if (selectedOption && selectedOption.getAttribute('data-quantity')) {
      const availableQty = parseInt(selectedOption.getAttribute('data-quantity'));
      const requestedQty = parseInt(quantityInput.value);
      
      if (requestedQty > availableQty) {
        quantityInput.setCustomValidity('Only ' + availableQty + ' units available in stock');
        quantityInput.reportValidity();
      } else {
        quantityInput.setCustomValidity('');
      }
    }
  }

  console.log('Sales Script: Loaded');

})();