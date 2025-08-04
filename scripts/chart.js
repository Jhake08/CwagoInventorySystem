let revenueChart;
let categoryChart;

function initCharts() {
    // Initialize chart containers
    const revenueCtx = document.getElementById('revenue-chart').getContext('2d');
    const categoryCtx = document.getElementById('category-chart').getContext('2d');
    
    // Create placeholder charts
    revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Revenue',
                data: [],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: getChartOptions('Revenue ($)')
    });
    
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#4361ee',
                    '#3f37c9',
                    '#4895ef',
                    '#4cc9f0',
                    '#f72585'
                ],
                borderWidth: 0
            }]
        },
        options: getChartOptions()
    });
}

function updateCharts(data) {
    // Update Revenue Chart
    updateRevenueChart(data);
    
    // Update Category Chart
    updateCategoryChart(data);
}

function updateRevenueChart(data) {
    // Group by month (simplified for demo)
    const monthlyData = {};
    
    data.forEach(item => {
        const date = new Date(item.date);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = 0;
        }
        
        monthlyData[monthYear] += item.totalRevenue;
    });
    
    const labels = Object.keys(monthlyData).sort();
    const revenueData = labels.map(label => monthlyData[label]);
    
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = revenueData;
    revenueChart.update();
}

function updateCategoryChart(data) {
    // Group by category
    const categoryData = {};
    
    data.forEach(item => {
        if (!categoryData[item.category]) {
            categoryData[item.category] = 0;
        }
        
        categoryData[item.category] += item.totalRevenue;
    });
    
    const labels = Object.keys(categoryData);
    const categoryValues = labels.map(label => categoryData[label]);
    
    categoryChart.data.labels = labels;
    categoryChart.data.datasets[0].data = categoryValues;
    categoryChart.update();
}

function getChartOptions(title) {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuad'
        }
    };
    
    if (title) {
        commonOptions.plugins.title = {
            display: true,
            text: title,
            font: {
                size: 14
            }
        };
    }
    
    if (title === 'Revenue ($)') {
        commonOptions.scales = {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        };
    }
    
    return commonOptions;
}