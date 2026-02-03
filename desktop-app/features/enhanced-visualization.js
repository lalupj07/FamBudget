// Enhanced Visualization Manager
class EnhancedVisualizationManager {
    constructor(app) {
        this.app = app;
        this.charts = {};
        this.chartConfigs = {};
    }

    init() {
        this.setupChartConfigs();
    }

    setupChartConfigs() {
        this.chartConfigs = {
            interactive: true,
            animations: true,
            responsive: true,
            maintainAspectRatio: false
        };
    }

    // Create interactive chart
    createInteractiveChart(canvasId, type, data, options = {}) {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return null;
        }

        const container = document.getElementById(canvasId);
        if (!container) {
            console.error(`Container with ID "${canvasId}" not found`);
            return null;
        }
        
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            container.appendChild(canvas);
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get 2D context');
            return null;
        }

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: (context) => {
                            return `${context.dataset.label}: ${this.app.formatCurrency(context.parsed.y || context.parsed)}`;
                        }
                    }
                },
                legend: {
                    display: options.showLegend !== false,
                    position: options.legendPosition || 'top'
                }
            },
            animation: {
                duration: options.animationDuration || 1000,
                easing: 'easeInOutQuart'
            },
            transitions: {
                active: {
                    animation: {
                        duration: 300
                    }
                }
            }
        };

        const mergedOptions = { ...defaultOptions, ...options };

        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: type,
            data: data,
            options: mergedOptions
        });

        return this.charts[canvasId];
    }

    // Create line chart
    createLineChart(canvasId, labels, datasets, options = {}) {
        const data = {
            labels: labels,
            datasets: datasets.map((ds, index) => ({
                label: ds.label,
                data: ds.data,
                borderColor: ds.color || this.getColor(index),
                backgroundColor: ds.fillColor || this.getColor(index, 0.1),
                borderWidth: 2,
                fill: ds.fill !== false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: ds.color || this.getColor(index),
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }))
        };

        return this.createInteractiveChart(canvasId, 'line', data, options);
    }

    // Create bar chart
    createBarChart(canvasId, labels, datasets, options = {}) {
        const container = document.getElementById(canvasId);
        if (!container) return null;
        
        // Ensure canvas exists
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            container.innerHTML = '';
            container.appendChild(canvas);
        }
        
        const data = {
            labels: labels,
            datasets: datasets.map((ds, index) => ({
                label: ds.label,
                data: ds.data,
                backgroundColor: ds.colors || ds.data.map((_, i) => this.getColor(i, 0.8)),
                borderColor: ds.borderColors || ds.data.map((_, i) => this.getColor(i)),
                borderWidth: 1,
                borderRadius: 4
            }))
        };

        return this.createInteractiveChart(canvasId, 'bar', data, options);
    }

    // Create area chart
    createAreaChart(canvasId, labels, datasets, options = {}) {
        const data = {
            labels: labels,
            datasets: datasets.map((ds, index) => ({
                label: ds.label,
                data: ds.data,
                borderColor: ds.color || this.getColor(index),
                backgroundColor: ds.fillColor || this.getColor(index, 0.3),
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }))
        };

        return this.createInteractiveChart(canvasId, 'line', data, options);
    }

    // Create pie/doughnut chart
    createPieChart(canvasId, labels, data, options = {}) {
        const container = document.getElementById(canvasId);
        if (!container) return null;
        
        // Ensure canvas exists
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            container.innerHTML = '';
            container.appendChild(canvas);
        }
        
        const chartData = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: data.map((_, i) => this.getColor(i, 0.8)),
                borderColor: data.map((_, i) => this.getColor(i)),
                borderWidth: 2
            }]
        };

        const chartOptions = {
            ...options,
            plugins: {
                ...options.plugins,
                tooltip: {
                    ...options.plugins?.tooltip,
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${this.app.formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        };

        return this.createInteractiveChart(canvasId, options.type || 'pie', chartData, chartOptions);
    }

    // Create comparison chart (this year vs last year)
    createComparisonChart(canvasId, thisYearData, lastYearData, labels, options = {}) {
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'This Year',
                    data: thisYearData,
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Last Year',
                    data: lastYearData,
                    borderColor: '#757575',
                    backgroundColor: 'rgba(117, 117, 117, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        };

        return this.createInteractiveChart(canvasId, 'line', data, options);
    }

    // Get color from palette
    getColor(index, alpha = 1) {
        const colors = [
            `rgba(25, 118, 210, ${alpha})`,   // Blue
            `rgba(46, 125, 50, ${alpha})`,    // Green
            `rgba(244, 67, 54, ${alpha})`,    // Red
            `rgba(255, 152, 0, ${alpha})`,    // Orange
            `rgba(156, 39, 176, ${alpha})`,   // Purple
            `rgba(0, 188, 212, ${alpha})`,    // Cyan
            `rgba(255, 87, 34, ${alpha})`,    // Deep Orange
            `rgba(76, 175, 80, ${alpha})`     // Light Green
        ];
        return colors[index % colors.length];
    }

    // Update chart with animation
    updateChart(canvasId, newData) {
        const chart = this.charts[canvasId];
        if (!chart) return;

        chart.data = newData;
        chart.update('active');
    }

    // Animate chart data change
    animateChartUpdate(canvasId, newData, duration = 1000) {
        const chart = this.charts[canvasId];
        if (!chart) return;

        chart.data = newData;
        chart.update({
            duration: duration,
            easing: 'easeInOutQuart'
        });
    }

    // Export chart as image
    exportChart(canvasId, filename = 'chart.png') {
        const chart = this.charts[canvasId];
        if (!chart) return;

        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    }

    // Destroy chart
    destroyChart(canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
        }
    }

    // Destroy all charts
    destroyAllCharts() {
        Object.keys(this.charts).forEach(id => {
            this.destroyChart(id);
        });
    }
}

if (typeof window !== 'undefined') {
    window.EnhancedVisualizationManager = EnhancedVisualizationManager;
}
