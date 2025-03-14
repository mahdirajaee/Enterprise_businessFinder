/**
 * DomUtils.js
 * 
 * Utility functions for DOM manipulation
 */

/**
 * Create a DOM element with attributes and content
 * @param {string} tag Tag name
 * @param {Object} attrs Element attributes
 * @param {string|Node|Array} content Element content
 * @returns {Element} Created element
 */
export function createElement(tag, attrs = {}, content = '') {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // Set content
    if (content) {
      if (Array.isArray(content)) {
        content.forEach(item => {
          if (item instanceof Node) {
            element.appendChild(item);
          } else {
            element.appendChild(document.createTextNode(String(item)));
          }
        });
      } else if (content instanceof Node) {
        element.appendChild(content);
      } else {
        element.textContent = String(content);
      }
    }
    
    return element;
  }
  
  /**
   * Create HTML from string
   * @param {string} html HTML string
   * @returns {DocumentFragment} Document fragment
   */
  export function createFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
  }
  
  /**
   * Remove all child nodes of an element
   * @param {Element} element Element to clear
   */
  export function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  
  /**
   * Toggle element visibility
   * @param {Element} element Element to toggle
   * @param {boolean} visible Visibility state
   */
  export function toggleVisibility(element, visible) {
    if (visible === undefined) {
      element.classList.toggle('hidden');
    } else {
      element.classList.toggle('hidden', !visible);
    }
  }
  
  /**
   * Add event listener with automatic cleanup
   * @param {Element} element Element to attach event to
   * @param {string} event Event name
   * @param {Function} handler Event handler
   * @returns {Function} Function to remove event listener
   */
  export function addEventWithCleanup(element, event, handler) {
    element.addEventListener(event, handler);
    
    return () => {
      element.removeEventListener(event, handler);
    };
  }
  
  /**
   * Create a debounced function
   * @param {Function} func Function to debounce
   * @param {number} wait Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Create a throttled function
   * @param {Function} func Function to throttle
   * @param {number} limit Limit in milliseconds
   * @returns {Function} Throttled function
   */
  export function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    
    return function executedFunction(...args) {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }
  
  /**
   * Format number with commas
   * @param {number} number Number to format
   * @returns {string} Formatted number
   */
  export function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * Format date string
   * @param {string} dateString Date string
   * @param {Object} options Intl.DateTimeFormat options
   * @returns {string} Formatted date
   */
  export function formatDate(dateString, options = {}) {
    const date = new Date(dateString);
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Intl.DateTimeFormat('en-US', mergedOptions).format(date);
  }