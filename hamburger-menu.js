/**
 * Hamburger Menu for Filters
 * A clean implementation of a hamburger menu with filter functionality
 * Version 1.1 - Redesigned with instructions and filters only
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Hamburger menu initialization...');
    
    // Check if we're on a login page
    if (isLoginPage()) {
        console.log('Login page detected, not initializing hamburger menu');
        return;
    }
    
    // First, clean up any existing navigation elements
    cleanupExistingNavigation();
    
    // Create and inject the hamburger menu and filter functionality
    createHamburgerMenu();
    
    // Keep the name search on the main page, but hide other filters
    preserveMainSearch();
});

/**
 * Detects if the current page is a login page
 */
function isLoginPage() {
    // Check for password field
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

/**
 * Removes any existing navigation elements from previous implementations
 * Super aggressive cleanup to ensure no conflicts with existing functionalities
 */
function cleanupExistingNavigation() {
    console.log('Starting super aggressive cleanup of existing elements...');
    
    // Remove all traces of previous implementations
    
    // 1. Remove floating search button
    const floatingButton = document.querySelector('.floating-search-button');
    if (floatingButton) floatingButton.remove();
    
    // 2. Remove floating search panel
    const searchPanel = document.querySelector('.floating-search-panel');
    if (searchPanel) searchPanel.remove();
    
    // 3. Remove search toggle button
    const searchToggle = document.querySelector('.search-toggle-button');
    if (searchToggle) searchToggle.remove();
    
    // 4. Remove header control elements
    const headerControls = document.querySelectorAll('.compact-header');
    headerControls.forEach(el => el.remove());
    
    // 5. Remove instructions toggle button
    const instructionsToggle = document.querySelector('.instructions-toggle');
    if (instructionsToggle) instructionsToggle.remove();
    
    // 6. Find and hide/remove the expandable instructions
    const instructionsBox = document.querySelector('.collapsible-box');
    if (instructionsBox) {
        instructionsBox.remove(); // Remove completely instead of just hiding
    }
    
    // 7. Find any elements with instructions in the header and remove them
    document.querySelectorAll('.filter-container > div:not(.primary-search):not(.secondary-filters)').forEach(el => {
        if (el.textContent.includes('Aufgaben') || el.textContent.includes('Anleitung')) {
            el.remove();
        }
    });
    
    // 8. Disable any other header scripts by nullifying their functions
    if (window.updateHeaderVisibility) window.updateHeaderVisibility = function() {};
    if (window.showHeader) window.showHeader = function() {};
    if (window.hideHeader) window.hideHeader = function() {};
    if (window.toggleInstructions) window.toggleInstructions = function() {};
    
    // 9. Remove any event listeners on scroll and other critical events
    window.onscroll = null;
    
    // 10. Hide only the secondary filters (not the primary search)
    const filterElements = document.querySelectorAll('.secondary-filters');
    filterElements.forEach(el => {
        el.remove(); // Remove instead of just hiding
    });
    
    // 11. Remove any pre-existing hamburger menu elements to prevent duplicates
    document.querySelectorAll('.hamburger-menu-button, .hamburger-menu-container').forEach(el => {
        el.remove();
    });
    
    // 12. Remove any smart header classes from header section
    const headerSection = document.querySelector('.header-section');
    if (headerSection) {
        headerSection.classList.remove('header-hidden', 'sticky-visible');
        headerSection.style.transform = '';
        headerSection.style.opacity = '1';
        headerSection.style.visibility = 'visible';
    }
    
    console.log('Completed super aggressive cleanup of existing navigation elements');
}

/**
 * Preserves and enhances the main search field on the page
 * and adds a note about instructions in the hamburger menu
 */
function preserveMainSearch() {
    // Find the primary search input
    const primarySearch = document.querySelector('.primary-search');
    
    // Find and remove the expandable instruction on main page
    const expandableInstructions = document.querySelector('.filter-container > div:not(.compact-header):not(.primary-search):not(.secondary-filters)');
    if (expandableInstructions) {
        expandableInstructions.style.display = 'none';
    }
    
    if (primarySearch) {
        // Make sure it's visible
        primarySearch.style.display = 'block';
        primarySearch.style.opacity = '1';
        
        // Enhance the style of the input
        const searchInput = primarySearch.querySelector('input');
        if (searchInput) {
            searchInput.style.width = '100%';
            searchInput.style.padding = '10px 15px';
            searchInput.style.fontSize = '16px';
            searchInput.style.border = '1px solid #444';
            searchInput.style.borderRadius = '4px';
            searchInput.style.backgroundColor = '#2d2d2d';
            searchInput.style.color = 'white';
            searchInput.style.marginBottom = '15px';
        }
        
        // Add a prominent note about instructions in the hamburger menu
        const instructionsNote = document.createElement('div');
        instructionsNote.className = 'instructions-note';
        instructionsNote.innerHTML = '<p>⚠️ <strong>Filter und Anleitungen</strong> im ☰ Menü oben rechts</p>';
        instructionsNote.style.textAlign = 'center';
        instructionsNote.style.color = '#FFD700';
        instructionsNote.style.fontSize = '16px';
        instructionsNote.style.fontWeight = 'bold';
        instructionsNote.style.padding = '10px';
        instructionsNote.style.marginBottom = '15px';
        instructionsNote.style.border = '1px dashed rgba(255, 215, 0, 0.5)';
        instructionsNote.style.borderRadius = '6px';
        instructionsNote.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
        
        // Insert note before the search input
        primarySearch.parentNode.insertBefore(instructionsNote, primarySearch);
    } else {
        console.warn('Primary search not found, could not preserve it');
    }
}

/**
 * Creates and injects the hamburger menu with filter functionality
 */
function createHamburgerMenu() {
    // Create the CSS for the hamburger menu
    injectHamburgerStyles();
    
    // Create hamburger button
    const hamburgerButton = document.createElement('div');
    hamburgerButton.className = 'hamburger-menu-button';
    hamburgerButton.innerHTML = `
        <div class="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.className = 'hamburger-menu-container';
    
    // Get instructions text
    const instructionsText = getInstructionsText();
    
    // Create menu content
    menuContainer.innerHTML = `
        <div class="menu-section menu-instructions">
            <h3>Anleitung</h3>
            ${instructionsText}
        </div>
        
        <div class="menu-section menu-filter-section">
            <h3>Filter</h3>
            <div class="menu-filter-options">
                <label for="menu-day-filter">Tag auswählen:</label>
                <select id="menu-day-filter" class="menu-day-filter">
                    <option value="">Alle Tage</option>
                </select>
                
                <label for="menu-task-filter">Aufgabe suchen:</label>
                <div class="menu-task-search-combo">
                    <input type="text" id="menu-task-filter" class="menu-task-filter" placeholder="Aufgabe suchen...">
                    <div class="menu-task-dropdown" style="display: none;"></div>
                </div>
            </div>
            <button class="menu-reset-button">Filter zurücksetzen</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(hamburgerButton);
    document.body.appendChild(menuContainer);
    
    // Get the day filter dropdown and add an exact copy of days from the original app
    const dayFilter = menuContainer.querySelector('.menu-day-filter');
    
    // Create exact copies of the days based on your screenshot
    // In your first screenshot, the days are formatted as "Freitag, 22. August", etc.
    const kirmesExactDays = [
        { value: "Freitag", text: "Freitag, 22. August" },
        { value: "Samstag", text: "Samstag, 23. August" },
        { value: "Sonntag", text: "Sonntag, 24. August" },
        { value: "Montag", text: "Montag, 25. August" },
        { value: "Dienstag", text: "Dienstag, 26. August" },
        { value: "Mittwoch", text: "Mittwoch, 27. August" }
    ];
    
    // First try to find if there's an existing select with these days to copy from
    const allSelects = document.querySelectorAll('select');
    let existingSelect = null;
    
    // Try to find the exact select from the main app
    for (const select of allSelects) {
        const hasAugustOptions = Array.from(select.options || []).some(opt => 
            opt.textContent && opt.textContent.includes("August")
        );
        
        if (hasAugustOptions) {
            existingSelect = select;
            console.log('Found select with August days:', select);
            break;
        }
    }
    
    // If we found an existing select with the correct options, use those exact options
    if (existingSelect && Array.from(existingSelect.options).some(opt => opt.textContent.includes("August"))) {
        console.log('Copying exact day options from select');
        
        // First add "Alle Tage" option at the beginning
        const allDaysOpt = document.createElement('option');
        allDaysOpt.value = "";
        allDaysOpt.textContent = "Alle Tage";
        dayFilter.appendChild(allDaysOpt);
        
        // Then copy all other options exactly as they are
        Array.from(existingSelect.options).forEach(opt => {
            if (opt.value && opt.textContent && !opt.textContent.includes("Alle Tage")) {
                const newOpt = document.createElement('option');
                newOpt.value = opt.value;
                newOpt.textContent = opt.textContent;
                dayFilter.appendChild(newOpt);
            }
        });
    } else {
        // Use our hardcoded exact days from the screenshots
        console.log('Using hardcoded Kirmes days from screenshot');
        
        // Add each day exactly as in the screenshot
        kirmesExactDays.forEach(day => {
            const newOpt = document.createElement('option');
            newOpt.value = day.value;
            newOpt.textContent = day.text;
            dayFilter.appendChild(newOpt);
        });
    }
    
    console.log('Day options populated:', dayOptions);
    
    // Handle hamburger button click
    hamburgerButton.addEventListener('click', function() {
        this.classList.toggle('active');
        menuContainer.classList.toggle('active');
    });
    
    // Connect filter inputs to the original ones
    const taskInput = menuContainer.querySelector('.menu-task-filter');
    const resetBtn = menuContainer.querySelector('.menu-reset-button');

    // Copy any existing values from original filters to our menu filters
    const originalSelect = document.querySelector('.filter-select');
    if (originalSelect && originalSelect.value) {
        dayFilter.value = originalSelect.value;
    }
    
    const originalTaskInput = document.querySelector('.task-search-combo input');
    if (originalTaskInput && originalTaskInput.value) {
        taskInput.value = originalTaskInput.value;
    }

    // Connect filter to original controls with improved handling
    dayFilter.addEventListener('change', function() {
        // Try to find the original select if it wasn't found earlier
        const originalSelect = document.querySelector('.filter-select') || document.querySelector('select[class*="filter"]');
        
        if (originalSelect) {
            originalSelect.value = this.value;
            
            // Use multiple event dispatching methods to ensure React handlers are triggered
            const events = ['change', 'input'];
            
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                originalSelect.dispatchEvent(event);
            });
            
            // If using jQuery
            if (typeof jQuery !== 'undefined') {
                jQuery(originalSelect).trigger('change');
            }
            
            // Try to trigger React's onChange handler through a direct value property update
            if (originalSelect._valueTracker) {
                originalSelect._valueTracker.setValue('');
            }
            originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            // If we can't find the original select, we need to try another approach
            // Since this is a React app, we can try to find the React component and update its state
            console.log("Could not find original select element. Trying to sync filter value: " + this.value);
            
            // Store the selected value in localStorage as a fallback
            localStorage.setItem('kirmesSelectedDay', this.value);
        }
    });
    
    taskInput.addEventListener('input', function() {
        // Try to find the original input first
        const originalTaskInput = document.querySelector('.task-search-combo input') || 
                                document.querySelector('.task-search input');
        
        if (originalTaskInput) {
            originalTaskInput.value = this.value;
            
            // Use multiple event dispatching methods to ensure React handlers are triggered
            const events = ['input', 'keyup', 'change'];
            
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                originalTaskInput.dispatchEvent(event);
            });
            
            // If using jQuery
            if (typeof jQuery !== 'undefined') {
                jQuery(originalTaskInput).trigger('input');
            }
            
            // Try to trigger React's onChange handler through a direct value property update
            if (originalTaskInput._valueTracker) {
                originalTaskInput._valueTracker.setValue('');
            }
            originalTaskInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    
    resetBtn.addEventListener('click', function() {
        const resetButton = document.querySelector('.nav-btn');
        if (resetButton) {
            // Click the original reset button
            resetButton.click();
            
            // Reset our UI too
            setTimeout(() => {
                dayFilter.value = '';
                taskInput.value = '';
            }, 50);
        } else {
            // Fallback if reset button not found
            if (originalSelect) originalSelect.value = '';
            if (originalTaskInput) originalTaskInput.value = '';
            
            // Reset our UI
            dayFilter.value = '';
            taskInput.value = '';
            
            // Trigger events
            if (originalSelect) {
                const event = new Event('change', { bubbles: true });
                originalSelect.dispatchEvent(event);
            }
            
            if (originalTaskInput) {
                const event = new Event('input', { bubbles: true });
                originalTaskInput.dispatchEvent(event);
            }
        }
    });    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuContainer.contains(event.target) && 
            !hamburgerButton.contains(event.target) &&
            menuContainer.classList.contains('active')) {
            menuContainer.classList.remove('active');
            hamburgerButton.classList.remove('active');
        }
    });
    
    console.log('Hamburger menu created successfully');
}

/**
 * Returns the HTML content for the instructions section
 */
function getInstructionsText() {
    return `
        <div class="menu-instructions-content">
            <h3>🔍 So funktioniert die Suche:</h3>
            <div class="dot-instruction-list">
                <p class="dot-instruction">● Gib deinen Namen ein ODER klicke auf deinen Namen in einer Aufgabe, um alle deine Aufgaben zu sehen</p>
                <p class="dot-instruction">● Tag oder Aufgabe filtern über die Dropdown-Menüs</p>
                <p class="dot-instruction">● Klicke erneut auf deinen Namen, um den Filter aufzuheben</p>
                <p class="dot-instruction">● Ergebnisse per WhatsApp an dich selbst oder andere senden</p>
                <p class="dot-instruction">● PDF erstellen oder Aufgaben ausdrucken</p>
            </div>
        </div>
    `;
}

/**
 * Injects the CSS styles for the hamburger menu
 */
function injectHamburgerStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        /* Hamburger Button Styles */
        .hamburger-menu-button {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 215, 0, 0.2);
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 4px;
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .hamburger-menu-button:hover {
            background-color: rgba(255, 215, 0, 0.3);
        }
        
        .hamburger-icon {
            width: 22px;
            height: 16px;
            position: relative;
        }
        
        .hamburger-icon span {
            display: block;
            position: absolute;
            height: 2px;
            width: 100%;
            background: #FFD700;
            border-radius: 2px;
            opacity: 1;
            left: 0;
            transform: rotate(0deg);
            transition: .25s ease-in-out;
        }
        
        .hamburger-icon span:nth-child(1) {
            top: 0px;
        }
        
        .hamburger-icon span:nth-child(2) {
            top: 7px;
        }
        
        .hamburger-icon span:nth-child(3) {
            top: 14px;
        }
        
        .hamburger-menu-button.active .hamburger-icon span:nth-child(1) {
            top: 7px;
            transform: rotate(45deg);
        }
        
        .hamburger-menu-button.active .hamburger-icon span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger-menu-button.active .hamburger-icon span:nth-child(3) {
            top: 7px;
            transform: rotate(-45deg);
        }
        
        /* Menu Container Styles */
        .hamburger-menu-container {
            position: fixed;
            top: 0;
            right: -300px;
            width: 280px;
            height: 100%;
            background-color: #1a1a1a;
            box-shadow: -2px 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
            transition: right 0.3s ease;
            padding: 60px 10px 20px;
            overflow-y: auto;
        }
        
        .hamburger-menu-container.active {
            right: 0;
        }
        
        /* Menu Content Styles */
        .menu-section {
            padding: 15px;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .menu-section h3 {
            color: #FFD700;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
            padding-bottom: 8px;
        }
        
        /* Instructions styles */
        .menu-instructions-content {
            color: #ddd;
            font-size: 14px;
            line-height: 1.5;
            background-color: #1a1a1a;
            border-radius: 4px;
            padding: 10px;
        }
        
        .menu-instructions-content h3 {
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 16px;
            display: flex;
            align-items: center;
        }
        
        .dot-instruction-list {
            margin-top: 10px;
        }
        
        .dot-instruction {
            color: #ffffff;
            margin-bottom: 10px;
            line-height: 1.4;
            display: flex;
            align-items: flex-start;
        }
        
        .dot-instruction:before {
            color: #FFD700;
            margin-right: 8px;
        }
        
        /* Filter styles */
        .menu-filter-options label {
            display: block;
            margin-bottom: 5px;
            color: #bbb;
            font-size: 14px;
        }
        
        .menu-filter-options select,
        .menu-filter-options input {
            width: 100%;
            padding: 10px;
            background-color: #2d2d2d;
            color: #FFD700;
            border: 1px solid rgba(255, 215, 0, 0.25);
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 15px;
        }
        
        /* Task search combo styling - matching original */
        .menu-task-search-combo {
            position: relative;
            width: 100%;
        }
        
        .menu-task-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #1a1a1a;
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 4px;
            z-index: 1001;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .menu-task-dropdown-item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
            color: #FFD700;
        }
        
        .menu-task-dropdown-item:hover {
            background-color: rgba(255, 215, 0, 0.1);
        }
        
        .menu-task-dropdown-item:last-child {
            border-bottom: none;
        }
        
        .menu-reset-button {
            width: 100%;
            padding: 10px;
            background-color: #2d2d2d;
            color: #FFD700;
            border: 1px solid #444;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 15px;
        }
        
        .menu-reset-button:hover {
            background-color: #3d3d3d;
        }
        
        /* Hide header padding */
        .main-layout {
            padding-top: 0 !important;
        }
        
        /* Mobile optimization */
        @media (max-width: 767px) {
            .hamburger-menu-container {
                width: 80%;
                right: -80%;
            }
        }
    `;
    
    document.head.appendChild(styles);
}
