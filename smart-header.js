/**
 * Smart Header Controller
 * Controls header visibility based on scroll direction
 */
console.log('Smart Header script loaded - v1.2');

// Check if we're on a login page
function isLoginPage() {
    // Check for password input
    if (document.querySelector('input[type="password"]')) return true;
    
    // Check for login button text
    const buttons = document.querySelectorAll('button');
    for (let btn of buttons) {
        if (btn.textContent && btn.textContent.includes('Dienstplan anzeigen')) return true;
    }
    
    // Check for text on the page that would indicate login
    const pageText = document.body.innerText || '';
    if (pageText.includes('Passwort eingeben') || 
        pageText.includes('WhatsApp Gruppe')) return true;
    
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Smart Header Controller initialized - Compact Menu Approach (Fixed)');
    
    // Immediately exit if on login page
    if (isLoginPage()) {
        console.log('Login page detected, not initializing header controls');
        return;
    }

    // Variables to track scroll position
    let lastScrollY = window.scrollY;
    let ticking = false;
    let headerHidden = false;
    let searchMenuVisible = false;

    // Get header element
    const header = document.querySelector('.header-section');
    const mainLayout = document.querySelector('.main-layout');

    if (!header || !mainLayout) {
        console.error('Header or main layout elements not found!');
        return;
    }

    console.log('Header elements found, setting up scroll handler');

    // Function to handle header visibility with simplified approach
    function updateHeaderVisibility() {
        const currentScrollY = window.scrollY;
        
        // At top of page or very close to it - always show header
        if (currentScrollY <= 30) {
            showHeader();
            
            // If search menu was open and we're back at top, auto-hide it
            if (searchMenuVisible && currentScrollY < 5) {
                // Wait a bit to avoid jarring experience
                setTimeout(() => {
                    if (window.scrollY < 5) {
                        searchMenuVisible = false;
                        const filterElements = document.querySelectorAll('.filter-container > *:not(.compact-header)');
                        filterElements.forEach(el => {
                            el.classList.add('filter-hidden');
                        });
                        
                        // Update button
                        const searchButton = document.querySelector('.search-toggle-button');
                        if (searchButton) {
                            searchButton.textContent = '🔍';
                            searchButton.title = 'Suche und Filter anzeigen';
                        }
                    }
                }, 1000);
            }
        } 
        // Anywhere else on the page - hide header but keep showing compact header if search is active
        else {
            hideHeader();
        }
        
        lastScrollY = currentScrollY;
    }

    function showHeader() {
        if (!header) return;
        
        // Remove hidden class
        header.classList.remove('header-hidden');
        
        // Adjust main layout padding to make space for header
        if (mainLayout) {
            const headerHeight = header.offsetHeight || 180;
            mainLayout.style.paddingTop = headerHeight + 'px';
        }
        
        headerHidden = false;
        console.log('Header shown at position:', window.scrollY);
    }

    function hideHeader() {
        if (!header) return;
        
        // Add hidden class
        header.classList.add('header-hidden');
        
        // Remove padding to free up space
        if (mainLayout) {
            mainLayout.style.paddingTop = '0px';
        }
        
        headerHidden = true;
        console.log('Header hidden at position:', window.scrollY);
    }

    // Add scroll event listener with throttling
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeaderVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Simplified touch event handling - we only need to check position, not direction
    window.addEventListener('touchmove', function() {
        // The scroll position check will be handled by updateHeaderVisibility
        // So we just need to call it during touch movement
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeaderVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    updateHeaderVisibility();
    
    // Create search toggle button
    const createSearchToggleButton = () => {
        // Check if we already added the button
        if (document.querySelector('.search-toggle-button')) {
            console.log('Search button already exists, skipping creation');
            return;
        }
        
        const headerContainer = document.querySelector('.header-section .filter-container');
        console.log('Looking for header container:', headerContainer);
        
        if (!headerContainer) {
            console.error('Header container not found for search button');
            
            // Log all filter containers for debugging
            const allContainers = document.querySelectorAll('.filter-container');
            console.log('All filter containers found:', allContainers.length, allContainers);
            
            // Try alternate selection method
            const alternateContainer = document.querySelector('.header-section');
            console.log('Alternate container search result:', alternateContainer);
            
            return;
        }
        
        // Create compact header with just title and search icon
        const compactHeader = document.createElement('div');
        compactHeader.className = 'compact-header';
        compactHeader.innerHTML = '<h1>Dienstplan 2025 test</h1><button class="search-toggle-button" title="Suche und Filter anzeigen">🔍</button>';
        
        // Insert the compact header at the beginning of the filter container
        headerContainer.insertBefore(compactHeader, headerContainer.firstChild);
        
        // Hide the filter elements initially
        const filterElements = document.querySelectorAll('.filter-container > *:not(.compact-header)');
        filterElements.forEach(el => {
            el.classList.add('filter-hidden');
        });
        
        // Add click handler to search button
        document.querySelector('.search-toggle-button').addEventListener('click', toggleSearchMenu);
    };
    
    // Function to toggle search menu visibility
    const toggleSearchMenu = () => {
        const filterElements = document.querySelectorAll('.filter-container > *:not(.compact-header)');
        searchMenuVisible = !searchMenuVisible;
        
        filterElements.forEach(el => {
            if (searchMenuVisible) {
                el.classList.remove('filter-hidden');
            } else {
                el.classList.add('filter-hidden');
            }
        });
        
        // Update button text
        const searchButton = document.querySelector('.search-toggle-button');
        if (searchButton) {
            searchButton.textContent = searchMenuVisible ? '✕' : '🔍';
            searchButton.title = searchMenuVisible ? 'Suche und Filter ausblenden' : 'Suche und Filter anzeigen';
        }
    };
    
    // Call once to set up
    setTimeout(createSearchToggleButton, 500);
    
    // Create a visual indicator for debugging
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.padding = '8px';
    indicator.style.background = 'rgba(0,0,0,0.7)';
    indicator.style.color = 'white';
    indicator.style.fontSize = '12px';
    indicator.style.borderRadius = '4px';
    indicator.style.zIndex = '9999';
    document.body.appendChild(indicator);
    
    // Update indicator regularly
    setInterval(function() {
        const scrollPos = window.scrollY;
        indicator.textContent = 'Scroll: ' + scrollPos + 'px | Header: ' + (headerHidden ? 'Hidden' : 'Visible') + ' | Search: ' + (searchMenuVisible ? 'Open' : 'Closed');
        indicator.style.backgroundColor = headerHidden ? 'green' : 'red';
    }, 100);
});
