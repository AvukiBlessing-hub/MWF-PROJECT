// ===============================
// Unified Sales Form Script
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  console.log('  Sales Script: Initializing...');

  // Form elements
  const form = document.querySelector('form');
  const customerName = document.getElementById('customerName');
  const productType = document.getElementById('productType');
  const stockId = document.getElementById('stockId');
  const quantity = document.getElementById('quantity');
  const quality = document.getElementById('quality');
  const costPrice = document.getElementById('costPrice');
  const paymentMethod = document.getElementById('paymentMethod');

  // ===============================
  // Load Stock Data from Backend
  // ===============================
  fetch('/api/stocklist')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch stock data');
      return response.json();
    })
    .then(stockItems => {
      console.log(` Loaded ${stockItems.length} stock items`);
      const overviewData = generateStockOverviewData(stockItems);
      window.stockOverviewData = overviewData;
      populateProductDropdown(overviewData);
    })
    .catch(err => {
      console.error(' Error loading stock data:', err);
      stockId.innerHTML = '<option value="">Unable to load products</option>';
    });

  // ===============================
  // Generate Simplified Stock Overview
  // ===============================
  function generateStockOverviewData(stockItems) {
    return stockItems
      .filter(item => item.productName && item.totalQuantity > 0)
      .map(item => ({
        _id: item._id,
        productName: item.productName,
        productType: item.productType,
        quantity: Number(item.totalQuantity)
      }))
      .sort((a, b) => a.productName.localeCompare(b.productName));
  }

  // ===============================
  // Populate Dropdown with Products
  // ===============================
  function populateProductDropdown(data, filterType) {
    stockId.innerHTML = '<option value="">-- Select Product --</option>';
    let filtered = data;

    if (filterType) {
      filtered = data.filter(d => d.productType.toLowerCase() === filterType.toLowerCase());
    }

    if (filtered.length === 0) {
      stockId.innerHTML = '<option value="">No stock available</option>';
      return;
    }

    filtered.forEach(item => {
      const option = document.createElement('option');
      option.value = item._id;
      option.dataset.quantity = item.quantity;
      option.textContent = `${item.productName} (Available: ${item.quantity}) ${getStockIndicator(item.quantity)}`;
      stockId.appendChild(option);
    });
  }

  function getStockIndicator(qty) {
    if (qty > 50) return '✓';
    if (qty > 20) return '⚠️';
    return '🔴';
  }

  // ===============================
  // Product Type Filtering
  // ===============================
  productType.addEventListener('change', function() {
    const selectedType = this.value;
    if (window.stockOverviewData) {
      populateProductDropdown(window.stockOverviewData, selectedType);
    }
    clearError(stockId);
  });

  // ===============================
  // Quantity Validation
  // ===============================
  quantity.addEventListener('input', validateQuantity);
  stockId.addEventListener('change', () => {
    quantity.value = '';
    clearError(quantity);
  });

  function validateQuantity() {
    const selectedOption = stockId.options[stockId.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.quantity) return;

    const available = parseInt(selectedOption.dataset.quantity);
    const requested = parseInt(quantity.value);

    if (requested > available) {
      showError(quantity, `Only ${available} units available`);
    } else {
      clearError(quantity);
    }
  }

  // ===============================
  // Real-Time Validation
  // ===============================
  customerName.addEventListener('blur', () => validateCustomerName(customerName));
  customerName.addEventListener('input', () => {
    if (customerName.value.trim().length > 0) clearError(customerName);
  });

  costPrice.addEventListener('blur', () => validateCostPrice(costPrice));
  costPrice.addEventListener('input', () => {
    if (parseFloat(costPrice.value) > 0) clearError(costPrice);
  });

  [productType, stockId, quality, paymentMethod].forEach(select => {
    select.addEventListener('change', () => {
      if (select.value) clearError(select);
    });
  });

  // ===============================
  // Form Submission Validation
  // ===============================
  form.addEventListener('submit', e => {
    let valid = true;

    if (!validateCustomerName(customerName)) valid = false;
    if (!productType.value) { showError(productType, 'Please select a product type'); valid = false; }
    if (!stockId.value) { showError(stockId, 'Please select a product'); valid = false; }
    if (!quantity.value || parseInt(quantity.value) < 1) {
      showError(quantity, 'Quantity must be at least 1');
      valid = false;
    } else validateQuantity();

    if (!quality.value) { showError(quality, 'Please select quality'); valid = false; }
    if (!validateCostPrice(costPrice)) valid = false;
    if (!paymentMethod.value) { showError(paymentMethod, 'Please select payment method'); valid = false; }

    if (!valid) e.preventDefault();
  });

  // ===============================
  // Validation Helpers
  // ===============================
  function validateCustomerName(input) {
    const val = input.value.trim();
    if (!val) return showError(input, 'Customer name is required'), false;
    if (val.length < 2) return showError(input, 'Name must be at least 2 characters'), false;
    if (!/^[a-zA-Z\s'-]+$/.test(val))
      return showError(input, 'Only letters, spaces, hyphens, apostrophes allowed'), false;
    clearError(input);
    return true;
  }

  function validateCostPrice(input) {
    const val = parseFloat(input.value);
    if (!input.value || isNaN(val)) return showError(input, 'Cost price is required'), false;
    if (val <= 0) return showError(input, 'Cost price must be greater than 0'), false;
    if (val > 1_000_000_000) return showError(input, 'Cost price seems unreasonably high'), false;
    clearError(input);
    return true;
  }

  // ===============================
  // Error Display Utilities
  // ===============================
  function showError(input, msg) {
    clearError(input);
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = msg;
    input.classList.add('invalid');
    input.parentNode.insertBefore(error, input.nextSibling);
  }

  function clearError(input) {
    input.classList.remove('invalid');
    const next = input.nextSibling;
    if (next && next.classList && next.classList.contains('error-message')) next.remove();
  }

  console.log(' Sales Script Ready');
});

// Sales Form Validation Script with Grouped Products

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const customerName = document.getElementById('customerName');
  const productType = document.getElementById('productType');
  const stockId = document.getElementById('stockId');
  const quantity = document.getElementById('quantity');
  const quality = document.getElementById('quality');
  const costPrice = document.getElementById('costPrice');
  const paymentMethod = document.getElementById('paymentMethod');

  // Organize grouped stocks by product type
  const stocksByType = {};
  
  if (window.groupedStocks && Array.isArray(window.groupedStocks)) {
    window.groupedStocks.forEach(function(stock) {
      const type = stock.productType;
      if (!stocksByType[type]) {
        stocksByType[type] = [];
      }
      stocksByType[type].push(stock);
    });
    
    console.log('Grouped stocks by type:', stocksByType);
  }

  // Populate products when type is selected
  productType.addEventListener('change', function() {
    const selectedType = this.value;
    stockId.innerHTML = '<option value="">-- Select Product --</option>';
    
    if (selectedType && stocksByType[selectedType]) {
      stocksByType[selectedType].forEach(function(stock) {
        const option = document.createElement('option');
        option.value = stock._id;
        option.textContent = stock.productName + ' (Available: ' + stock.availableQuantity + ')';
        option.dataset.available = stock.availableQuantity;
        option.dataset.productName = stock.productName;
        stockId.appendChild(option);
      });
      
      console.log('Loaded ' + stocksByType[selectedType].length + ' products for ' + selectedType);
    }
    
    // Clear any previous error when selection changes
    clearError(stockId);
    clearError(productType);
  });

  // Validate quantity against available stock in real-time
  quantity.addEventListener('input', function() {
    const selectedProduct = stockId.options[stockId.selectedIndex];
    if (selectedProduct && selectedProduct.dataset.available) {
      const available = parseInt(selectedProduct.dataset.available);
      const requested = parseInt(this.value);
      
      if (requested > available) {
        showError(this, 'Only ' + available + ' units available');
      } else if (requested > 0) {
        clearError(this);
      }
    }
  });

  // Real-time validation for customer name
  customerName.addEventListener('blur', function() {
    validateCustomerName(this);
  });

  customerName.addEventListener('input', function() {
    if (this.value.trim().length > 0) {
      clearError(this);
    }
  });

  // Real-time validation for cost price
  costPrice.addEventListener('blur', function() {
    validateCostPrice(this);
  });

  costPrice.addEventListener('input', function() {
    if (parseFloat(this.value) > 0) {
      clearError(this);
    }
  });

  // Clear errors on select changes
  [productType, stockId, quality, paymentMethod].forEach(function(select) {
    select.addEventListener('change', function() {
      if (this.value) {
        clearError(this);
      }
    });
  });

  // Form submission validation
  form.addEventListener('submit', function(e) {
    let isValid = true;

    // Validate customer name
    if (!validateCustomerName(customerName)) {
      isValid = false;
    }

    // Validate product type
    if (!productType.value) {
      showError(productType, 'Please select a product type');
      isValid = false;
    }

    // Validate stock selection
    if (!stockId.value) {
      showError(stockId, 'Please select a product');
      isValid = false;
    }

    // Validate quantity
    if (!quantity.value || parseInt(quantity.value) < 1) {
      showError(quantity, 'Quantity must be at least 1');
      isValid = false;
    } else {
      const selectedProduct = stockId.options[stockId.selectedIndex];
      if (selectedProduct && selectedProduct.dataset.available) {
        const available = parseInt(selectedProduct.dataset.available);
        const requested = parseInt(quantity.value);
        
        if (requested > available) {
          showError(quantity, 'Only ' + available + ' units available');
          isValid = false;
        }
      }
    }

    // Validate quality
    if (!quality.value) {
      showError(quality, 'Please select quality');
      isValid = false;
    }

    // Validate cost price
    if (!validateCostPrice(costPrice)) {
      isValid = false;
    }

    // Validate payment method
    if (!paymentMethod.value) {
      showError(paymentMethod, 'Please select a payment method');
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault();
      console.log('Form validation failed');
    } else {
      console.log('Form validated successfully');
    }
  });

  // Validation Functions
  function validateCustomerName(input) {
    const value = input.value.trim();
    
    if (!value) {
      showError(input, 'Customer name is required');
      return false;
    }
    
    if (value.length < 2) {
      showError(input, 'Name must be at least 2 characters');
      return false;
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      showError(input, 'Name can only contain letters, spaces, hyphens and apostrophes');
      return false;
    }
    
    clearError(input);
    return true;
  }

  function validateCostPrice(input) {
    const value = parseFloat(input.value);
    
    if (!input.value || isNaN(value)) {
      showError(input, 'Cost price is required');
      return false;
    }
    
    if (value <= 0) {
      showError(input, 'Cost price must be greater than 0');
      return false;
    }
    
    if (value > 1000000000) {
      showError(input, 'Cost price seems unreasonably high');
      return false;
    }
    
    clearError(input);
    return true;
  }

  function showError(input, message) {
    // Remove any existing error
    clearError(input);
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Add error class to input
    input.classList.add('invalid');
    
    // Insert error message after the input
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
  }

  function clearError(input) {
    input.classList.remove('invalid');
    
    // Remove error message if it exists
    const errorDiv = input.nextSibling;
    if (errorDiv && errorDiv.classList && errorDiv.classList.contains('error-message')) {
      errorDiv.remove();
    }
  }
});
