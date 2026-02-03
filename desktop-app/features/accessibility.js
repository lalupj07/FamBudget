// Accessibility Manager
class AccessibilityManager {
    constructor(app) {
        this.app = app;
        this.settings = {
            screenReader: false,
            highContrast: false,
            fontSize: 'medium', // small, medium, large, xlarge
            keyboardNavigation: true,
            reducedMotion: false
        };
    }

    async init() {
        await this.loadSettings();
        this.applySettings();
        this.setupKeyboardNavigation();
        this.setupScreenReader();
    }

    async loadSettings() {
        const stored = localStorage.getItem('fambudget_accessibility_settings');
        if (stored) {
            this.settings = { ...this.settings, ...JSON.parse(stored) };
        }
    }

    async saveSettings() {
        localStorage.setItem('fambudget_accessibility_settings', JSON.stringify(this.settings));
    }

    // Apply accessibility settings
    applySettings() {
        const body = document.body;

        // High contrast mode
        if (this.settings.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }

        // Font size
        body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
        body.classList.add(`font-${this.settings.fontSize}`);

        // Reduced motion
        if (this.settings.reducedMotion) {
            body.classList.add('reduced-motion');
        } else {
            body.classList.remove('reduced-motion');
        }

        // Screen reader
        this.setupARIA();
    }

    // Setup ARIA attributes for screen readers
    setupARIA() {
        // Add ARIA labels to buttons
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Add ARIA labels to icons
        document.querySelectorAll('.material-icons').forEach(icon => {
            if (!icon.getAttribute('aria-label')) {
                const parent = icon.closest('button, a');
                if (!parent || !parent.getAttribute('aria-label')) {
                    icon.setAttribute('aria-hidden', 'true');
                }
            }
        });

        // Add ARIA roles
        document.querySelectorAll('.modal').forEach(modal => {
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
        });

        // Add ARIA live regions for dynamic content
        if (!document.getElementById('aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
    }

    // Announce to screen readers
    announce(message, priority = 'polite') {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        if (!this.settings.keyboardNavigation) return;

        // Tab navigation
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay[style*="flex"], .modal-overlay[style*="block"]');
                if (openModal) {
                    this.app.hideModal();
                }
            }

            // Arrow keys for navigation
            if (e.key === 'ArrowRight' && e.ctrlKey) {
                const nextSection = this.getNextSection();
                if (nextSection) {
                    this.app.navigateToSection(nextSection);
                }
            }

            if (e.key === 'ArrowLeft' && e.ctrlKey) {
                const prevSection = this.getPreviousSection();
                if (prevSection) {
                    this.app.navigateToSection(prevSection);
                }
            }

            // Focus management
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });

        // Make all interactive elements keyboard accessible
        document.querySelectorAll('.nav-item, .btn, .modal-close').forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        });
    }

    // Handle tab navigation
    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    // Get next section
    getNextSection() {
        const sections = ['dashboard', 'transactions', 'accounts', 'income', 'goals', 'reports', 'settings'];
        const currentIndex = sections.indexOf(this.app.currentSection);
        return sections[currentIndex + 1] || null;
    }

    // Get previous section
    getPreviousSection() {
        const sections = ['dashboard', 'transactions', 'accounts', 'income', 'goals', 'reports', 'settings'];
        const currentIndex = sections.indexOf(this.app.currentSection);
        return sections[currentIndex - 1] || null;
    }

    // Toggle high contrast
    async toggleHighContrast() {
        this.settings.highContrast = !this.settings.highContrast;
        await this.saveSettings();
        this.applySettings();
        this.announce(`High contrast mode ${this.settings.highContrast ? 'enabled' : 'disabled'}`);
    }

    // Set font size
    async setFontSize(size) {
        this.settings.fontSize = size;
        await this.saveSettings();
        this.applySettings();
        this.announce(`Font size set to ${size}`);
    }

    // Toggle screen reader mode
    async toggleScreenReader() {
        this.settings.screenReader = !this.settings.screenReader;
        await this.saveSettings();
        this.setupARIA();
        this.announce(`Screen reader mode ${this.settings.screenReader ? 'enabled' : 'disabled'}`);
    }

    // Toggle reduced motion
    async toggleReducedMotion() {
        this.settings.reducedMotion = !this.settings.reducedMotion;
        await this.saveSettings();
        this.applySettings();
    }

    // Setup screen reader
    setupScreenReader() {
        if (!this.settings.screenReader) return;

        // Add skip to main content link
        if (!document.getElementById('skip-to-main')) {
            const skipLink = document.createElement('a');
            skipLink.id = 'skip-to-main';
            skipLink.href = '#dashboard';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Enhance form labels
        document.querySelectorAll('input, select, textarea').forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label && !input.getAttribute('aria-label')) {
                input.setAttribute('aria-label', label.textContent);
            }
        });
    }

    // Get accessibility settings
    getSettings() {
        return { ...this.settings };
    }
}

if (typeof window !== 'undefined') {
    window.AccessibilityManager = AccessibilityManager;
}
