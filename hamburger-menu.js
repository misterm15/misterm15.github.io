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
    //cleanupExistingNavigation();
    
    // Create and inject the hamburger menu and filter functionality
    createHamburgerMenu();
    
    // Keep the name search on the main page, but hide other filters
    //preserveMainSearch();
});






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
