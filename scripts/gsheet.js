// Google Sheets API configuration
const scriptURL = 'https://script.google.com/macros/s/AKfycbxWWL96AtilK4ib4Rw0CWDxU1pLekAyHUMN5gXA89xQhnUHpQBD6ZGJmlZ8qrINAH5f/exec'; // Replace with your Google Apps Script URL
const sheetID = '19pB5v1Y-4IK3sVsw3ushzsroPuwYUcD79Ei8lBUYSXM'; // Replace with your Google Sheet ID
const sheetName = 'Inventory'; // Your sheet name

// Fetch inventory data from Google Sheets
async function fetchInventoryData() {
    try {
        const response = await fetch(`${scriptURL}?action=getItems&sheetId=${sheetID}&sheetName=${sheetName}`);
        const data = await response.json();
        
        // Process data (convert string numbers to actual numbers)
        return data.map(item => ({
            ...item,
            costPrice: parseFloat(item.costPrice),
            sellingPrice: parseFloat(item.sellingPrice),
            stock: parseInt(item.stock),
            quantitySold: parseInt(item.quantitySold),
            remainingStocks: parseInt(item.remainingStocks),
            totalRevenue: parseFloat(item.totalRevenue),
            cogs: parseFloat(item.cogs),
            profit: parseFloat(item.profit)
        }));
    } catch (error) {
        console.error('Error fetching inventory data:', error);
        return [];
    }
}

// Add new item to Google Sheets
async function addItemToSheet(item) {
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'addItem',
                sheetId: sheetID,
                sheetName: sheetName,
                itemData: item
            })
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error adding item:', error);
        return false;
    }
}

// Delete item from Google Sheets
async function deleteItemFromSheet(itemId) {
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'deleteItem',
                sheetId: sheetID,
                sheetName: sheetName,
                itemId: itemId
            })
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error deleting item:', error);
        return false;
    }
}

// Update item in Google Sheets
async function updateItemInSheet(item) {
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'updateItem',
                sheetId: sheetID,
                sheetName: sheetName,
                itemData: item
            })
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error updating item:', error);
        return false;
    }
}