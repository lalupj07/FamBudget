// Dashboard Customization Manager
class DashboardCustomizationManager {
    constructor(app) {
        this.app = app;
        this.widgets = [];
        this.layouts = [];
        this.currentLayout = null;
    }

    async init() {
        await this.loadWidgets();
        await this.loadLayouts();
        this.setupDragAndDrop();
    }

    async loadWidgets() {
        const stored = localStorage.getItem('fambudget_dashboard_widgets');
        if (stored) {
            this.widgets = JSON.parse(stored);
        } else {
            // Default widgets
            this.widgets = [
                { id: 'summary-cards', name: 'Summary Cards', visible: true, order: 0, size: 'full' },
                { id: 'budget-warnings', name: 'Budget Warnings', visible: true, order: 1, size: 'full' },
                { id: 'category-chart', name: 'Category Chart', visible: true, order: 2, size: 'half' },
                { id: 'recent-transactions', name: 'Recent Transactions', visible: true, order: 3, size: 'half' },
                { id: 'budget-overview', name: 'Budget Overview', visible: true, order: 4, size: 'full' }
            ];
            await this.saveWidgets();
        }
    }

    async loadLayouts() {
        const stored = localStorage.getItem('fambudget_dashboard_layouts');
        if (stored) {
            this.layouts = JSON.parse(stored);
        } else {
            this.layouts = [
                { id: 'default', name: 'Default Layout', widgets: [...this.widgets] }
            ];
            await this.saveLayouts();
        }
    }

    async saveWidgets() {
        localStorage.setItem('fambudget_dashboard_widgets', JSON.stringify(this.widgets));
    }

    async saveLayouts() {
        localStorage.setItem('fambudget_dashboard_layouts', JSON.stringify(this.layouts));
    }

    // Setup drag and drop
    setupDragAndDrop() {
        // Use HTML5 drag and drop API
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initDragAndDrop());
        } else {
            this.initDragAndDrop();
        }
    }

    initDragAndDrop() {
        const dashboard = document.getElementById('dashboard');
        if (!dashboard) {
            // Retry after a short delay if dashboard not ready
            setTimeout(() => this.initDragAndDrop(), 100);
            return;
        }

            // Make widgets draggable
            this.widgets.forEach(widget => {
                const element = document.getElementById(widget.id);
                if (element) {
                    element.draggable = true;
                    element.dataset.widgetId = widget.id;
                    element.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', widget.id);
                        e.dataTransfer.effectAllowed = 'move';
                        element.classList.add('dragging');
                    });
                    element.addEventListener('dragend', () => {
                        element.classList.remove('dragging');
                    });
                }
            });

            // Setup drop zones
            const dropZones = dashboard.querySelectorAll('.dashboard-widget-container, .dashboard-grid, #dashboardGrid');
            dropZones.forEach(zone => {
                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    zone.classList.add('drag-over');
                });
                zone.addEventListener('dragleave', () => {
                    zone.classList.remove('drag-over');
                });
                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    const widgetId = e.dataTransfer.getData('text/plain');
                    this.moveWidget(widgetId, zone);
                });
            });
    }

    // Move widget to new position
    async moveWidget(widgetId, targetZone) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (!widget) return;

        // Update order based on position
        const widgets = Array.from(targetZone.querySelectorAll('[data-widget-id]'));
        const targetIndex = widgets.length;
        widget.order = targetIndex;

        // Reorder widgets
        this.widgets.sort((a, b) => a.order - b.order);
        await this.saveWidgets();
        this.renderDashboard();
    }

    // Toggle widget visibility
    async toggleWidget(widgetId) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.visible = !widget.visible;
            await this.saveWidgets();
            this.renderDashboard();
        }
    }

    // Change widget size
    async changeWidgetSize(widgetId, size) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.size = size; // 'full', 'half', 'third'
            await this.saveWidgets();
            this.renderDashboard();
        }
    }

    // Save current layout
    async saveCurrentLayout(name) {
        const layout = {
            id: Date.now(),
            name: name || `Layout ${this.layouts.length + 1}`,
            widgets: JSON.parse(JSON.stringify(this.widgets)),
            createdAt: new Date().toISOString()
        };
        this.layouts.push(layout);
        await this.saveLayouts();
        return layout;
    }

    // Load layout
    async loadLayout(layoutId) {
        const layout = this.layouts.find(l => l.id === layoutId);
        if (layout) {
            this.widgets = JSON.parse(JSON.stringify(layout.widgets));
            await this.saveWidgets();
            this.currentLayout = layout;
            this.renderDashboard();
        }
    }

    // Delete layout
    async deleteLayout(layoutId) {
        this.layouts = this.layouts.filter(l => l.id !== layoutId);
        await this.saveLayouts();
    }

    // Render dashboard with custom layout
    renderDashboard() {
        const dashboard = document.getElementById('dashboard');
        if (!dashboard) return;

        const visibleWidgets = this.widgets
            .filter(w => w.visible)
            .sort((a, b) => a.order - b.order);

        // Clear existing content
        const container = dashboard.querySelector('.dashboard-container') || dashboard;
        
        visibleWidgets.forEach(widget => {
            const element = document.getElementById(widget.id);
            if (element) {
                element.style.display = widget.visible ? 'block' : 'none';
                element.className = `dashboard-widget widget-${widget.size}`;
                element.dataset.widgetId = widget.id;
                element.draggable = true;
            }
        });
    }

    // Get widget configuration
    getWidgetConfig(widgetId) {
        return this.widgets.find(w => w.id === widgetId);
    }

    // Reset to default layout
    async resetToDefault() {
        const defaultLayout = this.layouts.find(l => l.id === 'default');
        if (defaultLayout) {
            await this.loadLayout('default');
        } else {
            // Reset widgets to defaults
            this.widgets = [
                { id: 'summary-cards', name: 'Summary Cards', visible: true, order: 0, size: 'full' },
                { id: 'budget-warnings', name: 'Budget Warnings', visible: true, order: 1, size: 'full' },
                { id: 'category-chart', name: 'Category Chart', visible: true, order: 2, size: 'half' },
                { id: 'recent-transactions', name: 'Recent Transactions', visible: true, order: 3, size: 'half' },
                { id: 'budget-overview', name: 'Budget Overview', visible: true, order: 4, size: 'full' }
            ];
            await this.saveWidgets();
            this.renderDashboard();
        }
    }
}

if (typeof window !== 'undefined') {
    window.DashboardCustomizationManager = DashboardCustomizationManager;
}
