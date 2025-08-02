/**
 * Independent Search Button Injector
 * Creates a floating search button that doesn't depend on the existing structure
 * Version 2.0 - With improved login detection and precise positioning
 */
console.log('Independent search button loader - v2.0');

// Remove any existing search button immediately - needed in case this script runs multiple times
(function() {
    const existingButton = document.querySelector('.floating-search-button');
    if (existingButton) {
        existingButton.remove();
    }
    
    const existingPanel = document.querySelector('.floating-search-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Also remove any search-toggle-button from smart-header.js
    const smartHeaderButton = document.querySelector('.search-toggle-button');
    if (smartHeaderButton) {
        smartHeaderButton.remove();
    }
})();

// First check if we're on login screen before doing anything else
function isLoginPage() {
    // Check for password input
    if (document.querySelector('input[type="password"]')) return true;
    
    // Check for login button text
    const buttons = document.querySelectorAll('button');
    for (let btn of buttons) {
        if (btn.textContent && btn.textContent.includes('Dienstplan anzeigen')) return true;
    }
    
    // Check for login container
    if (document.querySelector('.login-container')) return true;
    
    // Check for text on the page that would indicate login
    const pageText = document.body.innerText || '';
    if (pageText.includes('Passwort eingeben') || 
        pageText.includes('WhatsApp Gruppe')) return true;
    
    return false;
}

// Add CSS animations for the search panel
const style = document.createElement('style');
style.textContent = `
@keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-20px); opacity: 0; }
}

.floating-search-panel {
    animation: slideDown 0.3s ease;
}

.floating-search-panel.hiding {
    animation: slideUp 0.3s ease;
}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Creating independent search button - checking if login page');
    
    // Use our improved login detection function
    if (isLoginPage()) {
        console.log('Login screen detected, not showing search button');
        return; // Exit early, don't create button on login screen
    }
    
    console.log('Not a login page, creating search button');
    
    // Create floating search button
    function createFloatingSearchButton() {
        // Check if button already exists
        if (document.querySelector('.floating-search-button')) return;
        
        // Create floating container
        const floatingButton = document.createElement('div');
        floatingButton.className = 'floating-search-button';
        floatingButton.innerHTML = '🔍';
        floatingButton.title = 'Suche und Filter anzeigen';
        
        // Add styles - fixed position in exact location like in the screenshot
        floatingButton.style.position = 'fixed';
        floatingButton.style.top = '8px'; // Match the position in the screenshot
        floatingButton.style.right = '8px'; // Match the position in the screenshot
        floatingButton.style.width = '36px'; 
        floatingButton.style.height = '36px';
        floatingButton.style.borderRadius = '50%';
        floatingButton.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
        floatingButton.style.border = '1px solid rgba(255, 215, 0, 0.3)';
        floatingButton.style.color = '#FFD700';
        floatingButton.style.fontSize = '18px';
        floatingButton.style.display = 'flex';
        floatingButton.style.justifyContent = 'center';
        floatingButton.style.alignItems = 'center';
        floatingButton.style.cursor = 'pointer';
        floatingButton.style.zIndex = '10000';
        floatingButton.style.transition = 'all 0.2s ease';
        floatingButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        floatingButton.style.fontWeight = 'bold';
        
        // Add hover effect
        floatingButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
            this.style.transform = 'scale(1.05)';
        });
        
        floatingButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
            this.style.transform = 'scale(1)';
        });
        
        // Handle click - toggle filter visibility
        let filtersVisible = false;
        floatingButton.addEventListener('click', function() {
            filtersVisible = !filtersVisible;
            
            if (filtersVisible) {
                // Create a completely new floating search panel
                let searchPanel = document.querySelector('.floating-search-panel');
                if (!searchPanel) {
                    searchPanel = document.createElement('div');
                    searchPanel.className = 'floating-search-panel';
                    searchPanel.style.position = 'fixed';
                    searchPanel.style.top = '60px';
                    searchPanel.style.left = '0';
                    searchPanel.style.width = '100%';
                    searchPanel.style.backgroundColor = '#1a1a1a';
                    searchPanel.style.padding = '15px';
                    searchPanel.style.boxShadow = '0 3px 10px rgba(0,0,0,0.5)';
                    searchPanel.style.zIndex = '9999';
                    searchPanel.style.borderBottom = '1px solid rgba(255, 215, 0, 0.3)';
                    
                    // Create search input
                    const searchInput = document.createElement('input');
                    searchInput.type = 'text';
                    searchInput.placeholder = 'Nach Namen suchen...';
                    searchInput.style.width = '100%';
                    searchInput.style.padding = '12px';
                    searchInput.style.margin = '5px 0 15px 0';
                    searchInput.style.backgroundColor = '#2d2d2d';
                    searchInput.style.color = 'white';
                    searchInput.style.border = '1px solid #444';
                    searchInput.style.borderRadius = '4px';
                    searchInput.style.fontSize = '16px';
                    
                    // Create filter row
                    const filterRow = document.createElement('div');
                    filterRow.style.display = 'flex';
                    filterRow.style.justifyContent = 'space-between';
                    filterRow.style.gap = '10px';
                    
                    // Create day filter dropdown
                    const dayFilter = document.createElement('select');
                    dayFilter.style.flex = '1';
                    dayFilter.style.padding = '10px';
                    dayFilter.style.backgroundColor = '#2d2d2d';
                    dayFilter.style.color = 'white';
                    dayFilter.style.border = '1px solid #444';
                    dayFilter.style.borderRadius = '4px';
                    
                    // Add default option
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Alle Tage';
                    dayFilter.appendChild(defaultOption);
                    
                    // Copy options from existing dropdown if available
                    const existingSelect = document.querySelector('.filter-select');
                    if (existingSelect) {
                        Array.from(existingSelect.options).forEach(opt => {
                            if (opt.value !== '') {
                                const newOpt = document.createElement('option');
                                newOpt.value = opt.value;
                                newOpt.textContent = opt.textContent;
                                dayFilter.appendChild(newOpt);
                            }
                        });
                    }
                    
                    // Create task search
                    const taskSearch = document.createElement('input');
                    taskSearch.type = 'text';
                    taskSearch.placeholder = 'Aufgabe suchen...';
                    taskSearch.style.flex = '2';
                    taskSearch.style.padding = '10px';
                    taskSearch.style.backgroundColor = '#2d2d2d';
                    taskSearch.style.color = 'white';
                    taskSearch.style.border = '1px solid #444';
                    taskSearch.style.borderRadius = '4px';
                    
                    // Create reset button
                    const resetBtn = document.createElement('button');
                    resetBtn.textContent = 'Reset';
                    resetBtn.style.padding = '10px';
                    resetBtn.style.backgroundColor = '#2d2d2d';
                    resetBtn.style.color = '#FFD700';
                    resetBtn.style.border = '1px solid #444';
                    resetBtn.style.borderRadius = '4px';
                    resetBtn.style.cursor = 'pointer';
                    
                    // Add elements to filter row
                    filterRow.appendChild(dayFilter);
                    filterRow.appendChild(taskSearch);
                    filterRow.appendChild(resetBtn);
                    
                    // Add everything to search panel
                    searchPanel.appendChild(searchInput);
                    searchPanel.appendChild(filterRow);
                    
                    // Connect the new filters to the original ones
                    searchInput.addEventListener('input', function() {
                        const originalInput = document.querySelector('.primary-search input');
                        if (originalInput) {
                            originalInput.value = this.value;
                            // Trigger change event
                            const event = new Event('input', { bubbles: true });
                            originalInput.dispatchEvent(event);
                        }
                    });
                    
                    dayFilter.addEventListener('change', function() {
                        const originalSelect = document.querySelector('.filter-select');
                        if (originalSelect) {
                            originalSelect.value = this.value;
                            // Trigger change event
                            const event = new Event('change', { bubbles: true });
                            originalSelect.dispatchEvent(event);
                        }
                    });
                    
                    taskSearch.addEventListener('input', function() {
                        const originalInput = document.querySelector('.task-search-combo input');
                        if (originalInput) {
                            originalInput.value = this.value;
                            // Trigger change event
                            const event = new Event('input', { bubbles: true });
                            originalInput.dispatchEvent(event);
                        }
                    });
                    
                    resetBtn.addEventListener('click', function() {
                        const resetButton = document.querySelector('.nav-btn');
                        if (resetButton) {
                            resetButton.click();
                            // Reset our UI too
                            searchInput.value = '';
                            dayFilter.value = '';
                            taskSearch.value = '';
                        }
                    });
                    
                    document.body.appendChild(searchPanel);
                }
                
                searchPanel.style.display = 'block';
                searchPanel.classList.remove('hiding');
                // Force reflow to restart animation
                void searchPanel.offsetWidth;
                searchPanel.style.animation = 'slideDown 0.3s ease';
                
            } else {
                // Hide the search panel with animation
                const searchPanel = document.querySelector('.floating-search-panel');
                if (searchPanel) {
                    searchPanel.classList.add('hiding');
                    searchPanel.style.animation = 'slideUp 0.3s ease';
                    
                    // After animation completes, hide the panel
                    setTimeout(() => {
                        searchPanel.style.display = 'none';
                    }, 300);
                }
            }
            
            // Update button
            this.innerHTML = filtersVisible ? '✕' : '🔍';
            this.title = filtersVisible ? 'Suche und Filter ausblenden' : 'Suche und Filter anzeigen';
        });
        
        // Add to document
        document.body.appendChild(floatingButton);
        console.log('Floating search button created');
        
        // Initially hide filters after a short delay
        setTimeout(() => {
            // Hide filter elements
            const filterElements = document.querySelectorAll('.primary-search, .secondary-filters');
            filterElements.forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
            });
            
            // Also remove any padding to free up space
            const mainLayout = document.querySelector('.main-layout');
            if (mainLayout) {
                mainLayout.style.paddingTop = '0';
            }
            
            // Hide any instructions block
            const instructions = document.querySelector('.filter-container > div:not(.compact-header):not(.primary-search):not(.secondary-filters)');
            if (instructions) {
                instructions.style.display = 'none';
            }
            
            console.log('Initial filter hiding applied');
        }, 500);
    }
    
    // Create button after a short delay to ensure DOM is ready
    setTimeout(createFloatingSearchButton, 1000);
});
