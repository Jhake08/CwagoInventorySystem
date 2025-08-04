document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initApp();
});

function initApp() {
    // DOM Elements
    const addItemBtn = document.querySelector('.add-item-btn');
    const addItemModal = document.getElementById('add-item-modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const addItemForm = document.getElementById('add-item-form');
    
    // Event Listeners
    addItemBtn.addEventListener('click', openAddItemModal);
    modalCloseBtns.forEach(btn => btn.addEventListener('click', closeAllModals));
    addItemForm.addEventListener('submit', handleAddItemSubmit);
    
    // Load data from Google Sheets
    loadInventoryData();
    
    // Initialize charts
    initCharts();
}

function openAddItemModal() {
    const modal = document.getElementById('add-item-modal');
    modal.classList.add('active');
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => modal.classList.remove('active'));
}

function handleAddItemSubmit(e) {
    e.preventDefault();
    
    const itemName = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const costPrice = parseFloat(document.getElementById('cost-price').value);
    const sellingPrice = parseFloat(document.getElementById('selling-price').value);
    const initialStock = parseInt(document.getElementById('initial-stock').value);
    
    // Create new item object
    const newItem = {
        date: new Date().toISOString().split('T')[0],
        itemName,
        category,
        costPrice,
        sellingPrice,
        stock: initialStock,
        quantitySold: 0,
        remainingStocks: initialStock,
        totalRevenue: 0,
        cogs: 0,
        profit: 0
    };
    
    // Add to Google Sheets
    addItemToSheet(newItem);
    
    // Close modal and reset form
    closeAllModals();
    e.target.reset();
    
    // Refresh data
    loadInventoryData();
}

function loadInventoryData() {
    // This will be implemented in gsheet.js
    fetchInventoryData().then(data => {
        updateDashboardStats(data);
        updateInventoryTable(data);
        updateCharts(data);
    });
}

function updateDashboardStats(data) {
    // Calculate totals
    const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    const totalItems = data.length;
    const totalSold = data.reduce((sum, item) => sum + item.quantitySold, 0);
    
    // Update DOM
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('total-profit').textContent = `$${totalProfit.toFixed(2)}`;
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('items-sold').textContent = totalSold;
    
    // Calculate percentage changes (simplified for demo)
    const revenueChange = data.length > 0 ? Math.floor(Math.random() * 20) : 0;
    const profitChange = data.length > 0 ? Math.floor(Math.random() * 20) : 0;
    const itemsChange = data.length > 0 ? Math.floor(Math.random() * 10) - 5 : 0;
    const soldChange = data.length > 0 ? Math.floor(Math.random() * 15) : 0;
    
    // Update change indicators
    updateChangeIndicator('total-revenue', revenueChange);
    updateChangeIndicator('total-profit', profitChange);
    updateChangeIndicator('total-items', itemsChange);
    updateChangeIndicator('items-sold', soldChange);
}

function updateChangeIndicator(statId, change) {
    const statElement = document.getElementById(statId).parentElement;
    const changeElement = statElement.querySelector('.stat-change');
    
    if (change > 0) {
        changeElement.textContent = `+${change}% from last month`;
        changeElement.classList.add('positive');
        changeElement.classList.remove('negative');
    } else if (change < 0) {
        changeElement.textContent = `${change}% from last month`;
        changeElement.classList.add('negative');
        changeElement.classList.remove('positive');
    } else {
        changeElement.textContent = `No change from last month`;
        changeElement.classList.remove('positive', 'negative');
    }
}

function updateInventoryTable(data) {
    const tableBody = document.getElementById('inventory-table-body');
    tableBody.innerHTML = '';
    
    // Sort by most recent first
    const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take first 10 items for the table
    const recentItems = sortedData.slice(0, 10);
    
    recentItems.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.itemName}</td>
            <td><span class="category-badge">${item.category}</span></td>
            <td>${item.remainingStocks}</td>
            <td>$${item.sellingPrice.toFixed(2)}</td>
            <td>${item.quantitySold}</td>
            <td>$${item.totalRevenue.toFixed(2)}</td>
            <td class="${item.profit >= 0 ? 'positive' : 'negative'}">$${item.profit.toFixed(2)}</td>
            <td>
                <button class="btn-icon edit-btn" data-id="${item.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEditItem);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteItem);
    });
}

function handleEditItem(e) {
    const itemId = e.currentTarget.getAttribute('data-id');
    console.log('Edit item:', itemId);
    // Implement edit functionality
}

function handleDeleteItem(e) {
    const itemId = e.currentTarget.getAttribute('data-id');
    if (confirm('Are you sure you want to delete this item?')) {
        deleteItemFromSheet(itemId).then(() => {
            loadInventoryData();
        });
    }
}