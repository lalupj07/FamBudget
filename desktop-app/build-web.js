const fs = require('fs');
const path = require('path');

console.log('Building web version for GitHub Pages...');

const sourceDir = __dirname;
const buildDir = path.join(sourceDir, 'web-build');

// Clean build directory
if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir, { recursive: true });

// Files to copy
const filesToCopy = [
    'index.html',
    'app.js',
    'api.js', // Add API service
    'styles.css',
    'assets'
];

// Add debug script to app.js at the very beginning
let debugScript = `// FamBudget Web App - Debug version
console.log('app.js script loaded!');
`;

// Copy files
filesToCopy.forEach(file => {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(buildDir, file);
    
    if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
            // Copy directory recursively
            copyDir(srcPath, destPath);
        } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${file}`);
        }
    }
});

// Create .nojekyll file
fs.writeFileSync(path.join(buildDir, '.nojekyll'), '');
console.log('Created .nojekyll file');

// Modify app.js to remove Electron-specific code
const appJsPath = path.join(buildDir, 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Add debug log at the very beginning to verify script loads
appJsContent = 'console.log("FamBudget app.js loaded");\n' + appJsContent;

// Find and remove the Electron menu events block (lines ~316-325)
const electronBlockStart = '        // Electron menu events';
const electronBlockEnd = '        }';
const startIndex = appJsContent.indexOf(electronBlockStart);

if (startIndex !== -1) {
    // Find the next closing brace that matches the if block
    let i = startIndex;
    let braceCount = 0;
    let foundIf = false;
    
    // Find 'if (window.electronAPI)'
    const ifPattern = 'if (window.electronAPI)';
    const ifIndex = appJsContent.indexOf(ifPattern, startIndex);
    
    if (ifIndex !== -1) {
        // Find the opening brace after 'if'
        const openBraceIndex = appJsContent.indexOf('{', ifIndex);
        if (openBraceIndex !== -1) {
            braceCount = 1;
            
            // Find the matching closing brace
            for (i = openBraceIndex + 1; i < appJsContent.length; i++) {
                const char = appJsContent[i];
                
                // Skip strings
                if (char === '"' || char === "'" || char === '`') {
                    const quote = char;
                    i++;
                    while (i < appJsContent.length && appJsContent[i] !== quote) {
                        if (appJsContent[i] === '\\' && i + 1 < appJsContent.length) {
                            i += 2;
                        } else {
                            i++;
                        }
                    }
                    continue;
                }
                
                if (char === '{') braceCount++;
                if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        // Found the end of the if block
                        break;
                    }
                }
            }
            
            if (braceCount === 0) {
                // Replace from comment to closing brace
                const before = appJsContent.substring(0, startIndex);
                const after = appJsContent.substring(i + 1);
                appJsContent = before + after;
                console.log('Removed Electron menu events block');
            }
        }
    }
}

// Remove all remaining if (window.electronAPI) blocks - handle nested structures
appJsContent = appJsContent.replace(
    /if\s*\(window\.electronAPI\)\s*\{[\s\S]*?\}\s*else/g,
    '// Electron API removed for web version\n        if (false) // Web version - import/export not available'
);

// Then remove standalone if blocks
appJsContent = appJsContent.replace(
    /if\s*\(window\.electronAPI\)\s*\{[\s\S]*?\n\s*\}/g,
    '// Electron API removed for web version'
);

// Clean up broken syntax from import/export functions
// Find and replace the broken import/export functions using multiline matching
const importDataMatch = /async\s+importData\(\)\s*\{[\s\S]*?\/\/\s*Electron\s+API\s+removed[\s\S]*?else[\s\S]*?\}/;
const importDataReplacement = `async importData() {
        // Web version - import requires desktop app
        this.showMessage('Import functionality requires the desktop app version');
    }`;

if (importDataMatch.test(appJsContent)) {
    appJsContent = appJsContent.replace(importDataMatch, importDataReplacement);
}

const exportDataMatch = /async\s+exportData\(\)\s*\{[\s\S]*?\/\/\s*Electron\s+API\s+removed[\s\S]*?else[\s\S]*?\}/;
const exportDataReplacement = `async exportData() {
        // Web version - export requires desktop app
        this.showMessage('Export functionality requires the desktop app version');
    }`;

if (exportDataMatch.test(appJsContent)) {
    appJsContent = appJsContent.replace(exportDataMatch, exportDataReplacement);
}

// Fix the broken if (false) pattern
appJsContent = appJsContent.replace(
    /async\s+importData\(\)\s*\{[\s\S]*?if\s*\(false\)\s*\/\/\s*Web\s+version[\s\S]*?\{[\s]*this\.showMessage\([^)]*\);[\s]*\}/g,
    `async importData() {
        // Web version - import requires desktop app
        this.showMessage('Import functionality requires the desktop app version');
    }`
);

appJsContent = appJsContent.replace(
    /async\s+exportData\(\)\s*\{[\s\S]*?if\s*\(false\)\s*\/\/\s*Web\s+version[\s\S]*?\{[\s]*this\.showMessage\([^)]*\);[\s]*\}/g,
    `async exportData() {
        // Web version - export requires desktop app
        this.showMessage('Export functionality requires the desktop app version');
    }`
);

// Clean up any remaining orphaned fragments
appJsContent = appJsContent.replace(
    /,\s*\{[\s]*name:\s*['"'][^'"]*['"],\s*extensions:\s*\[[^\]]*\]\s*\}\]\s*\}\);/g,
    ''
);

appJsContent = appJsContent.replace(
    /\/\/\s*Electron\s+API\s+removed[\s,]*\{[\s\S]*?extensions/g,
    '            // Electron API removed for web version'
);

// Remove broken result usage in else blocks
appJsContent = appJsContent.replace(
    /if\s*\(!result\.canceled\)[\s\S]*?result\.filePaths\[0\]/g,
    'if (false) // Web version'
);

appJsContent = appJsContent.replace(
    /if\s*\(!result\.canceled\)[\s\S]*?result\.filePath/g,
    'if (false) // Web version'
);

// Remove other Electron API calls
appJsContent = appJsContent.replace(
    /window\.electronAPI\.[a-zA-Z]+\([^)]*\)/g,
    'null'
);

appJsContent = appJsContent.replace(
    /await\s+window\.electronAPI\?\./g,
    'null'
);

// Replace Chart.js loader with simpler web version
const chartJsLoaderStart = '    const loadChartJs = () => {';
const loaderStartIndex = appJsContent.indexOf(chartJsLoaderStart);

if (loaderStartIndex !== -1) {
    // Find the matching closing brace
    let braceCount = 0;
    let i = loaderStartIndex + chartJsLoaderStart.length;
    let inString = false;
    let stringChar = '';
    
    for (; i < appJsContent.length; i++) {
        const char = appJsContent[i];
        const prevChar = i > 0 ? appJsContent[i - 1] : '';
        
        // Handle strings
        if (!inString && (char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
            inString = true;
            stringChar = char;
        } else if (inString && char === stringChar && prevChar !== '\\') {
            inString = false;
        } else if (!inString) {
            if (char === '{') braceCount++;
            if (char === '}') {
                if (braceCount === 0) break;
                braceCount--;
            }
        }
    }
    
    if (i < appJsContent.length) {
        const before = appJsContent.substring(0, loaderStartIndex);
        const after = appJsContent.substring(i + 1);
        const webLoader = `    const loadChartJs = () => {
        return new Promise((resolve, reject) => {
            if (typeof Chart !== 'undefined') {
                console.log('Chart.js already loaded');
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js';
            script.onload = () => {
                if (typeof Chart !== 'undefined') {
                    console.log('Chart.js loaded successfully from CDN');
                    resolve();
                } else {
                    reject(new Error('Chart.js not available after loading'));
                }
            };
            script.onerror = () => {
                reject(new Error('Failed to load Chart.js from CDN'));
            };
            document.head.appendChild(script);
        });
    }`;
        appJsContent = before + webLoader + after;
        console.log('Replaced Chart.js loader with web version');
    }
}

// Remove any remaining Electron API references
appJsContent = appJsContent.replace(
    /window\.electronAPI\?\./g,
    'null?.'
);

// Fix initialization order - initialize app BEFORE waiting for Chart.js
// Find the DOMContentLoaded block and replace the entire initialization logic
const domContentLoadedPattern = /\/\/ Initialize the app when DOM is loaded[\s\S]*?document\.addEventListener\('DOMContentLoaded', \(\) => \{([\s\S]*?)\}\);[\s\S]*?\/\/ Add CSS for animations/g;

if (domContentLoadedPattern.test(appJsContent)) {
    const replacement = `// Initialize the app when DOM is loaded
(function() {
    'use strict';
    
    function initializeApp() {
        try {
            console.log('Initializing FamBudget app...');
            window.app = new FamBudgetApp();
            console.log('FamBudget app initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Error initializing app: ' + error.message);
        }
    }
    
    function loadChartJs() {
        return new Promise((resolve, reject) => {
            if (typeof Chart !== 'undefined') {
                console.log('Chart.js already loaded');
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js';
            script.onload = () => {
                if (typeof Chart !== 'undefined') {
                    console.log('Chart.js loaded successfully from CDN');
                    // Re-render charts now that Chart.js is available
                    if (window.app && window.app.data && window.app.data.dashboard) {
                        setTimeout(() => {
                            try {
                                if (window.app.renderCategoryChart) window.app.renderCategoryChart();
                                if (window.app.renderTrendsChart) window.app.renderTrendsChart();
                                if (window.app.renderBreakdownChart) window.app.renderBreakdownChart();
                            } catch (err) {
                                console.warn('Error rendering charts:', err);
                            }
                        }, 100);
                    }
                    resolve();
                } else {
                    reject(new Error('Chart.js not available after loading'));
                }
            };
            script.onerror = () => {
                console.warn('Failed to load Chart.js from CDN - charts will not work');
                reject(new Error('Failed to load Chart.js from CDN'));
            };
            document.head.appendChild(script);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM already loaded
        initializeApp();
    }
    
    // Load Chart.js in background (non-blocking)
    loadChartJs().catch(() => {
        console.warn('Charts will not be available');
    });
})();

// Add CSS for animations`;
    
    appJsContent = appJsContent.replace(domContentLoadedPattern, replacement);
    console.log('Fixed app initialization order');
}

// Final cleanup - remove any broken syntax
appJsContent = appJsContent.replace(
    /\n\s*\);\s*\n/g,
    '\n'
);

fs.writeFileSync(appJsPath, appJsContent);
console.log('Modified app.js for web compatibility');

console.log('Web build complete! Files are in web-build directory');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
