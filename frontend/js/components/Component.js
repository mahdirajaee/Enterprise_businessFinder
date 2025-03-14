/**
 * Component.js
 * 
 * Base class for all UI components
 * Provides common functionality for rendering and event handling
 */

export default class Component {
    /**
     * Initialize a component
     * @param {string|Element} container CSS selector or DOM element for the component
     * @param {Object} options Component options
     */
    constructor(container, options = {}) {
      // Store container reference
      this.container = typeof container === 'string' 
        ? document.querySelector(container) 
        : container;
      
      // Validate container
      if (!this.container) {
        throw new Error(`Container not found: ${container}`);
      }
      
      // Store options
      this.options = options;
      
      // Component state
      this.mounted = false;
    }
    
    /**
     * Render component HTML
     * Should be implemented by child classes
     */
    render() {
      throw new Error('Component.render() must be implemented by child classes');
    }
    
    /**
     * Mount component to the DOM
     * Renders HTML and attaches event listeners
     */
    mount() {
      if (this.mounted) return;
      
      this.render();
      this.attachEventListeners();
      this.mounted = true;
    }
    
    /**
     * Unmount component from the DOM
     * Cleans up event listeners and HTML
     */
    unmount() {
      if (!this.mounted) return;
      
      this.detachEventListeners();
      this.container.innerHTML = '';
      this.mounted = false;
    }
    
    /**
     * Update component
     * Re-renders and re-attaches event listeners
     */
    update() {
      this.detachEventListeners();
      this.render();
      this.attachEventListeners();
    }
    
    /**
     * Attach event listeners
     * Should be implemented by child classes
     */
    attachEventListeners() {
      // To be implemented by child classes
    }
    
    /**
     * Detach event listeners
     * Should be implemented by child classes
     */
    detachEventListeners() {
      // To be implemented by child classes
    }
    
    /**
     * Safely set HTML content
     * @param {string|Element} selector CSS selector or DOM element
     * @param {string} html HTML content
     */
    setHTML(selector, html) {
      const element = typeof selector === 'string'
        ? this.container.querySelector(selector)
        : selector;
      
      if (element) {
        element.innerHTML = html;
      }
    }
    
    /**
     * Safely set text content
     * @param {string|Element} selector CSS selector or DOM element
     * @param {string} text Text content
     */
    setText(selector, text) {
      const element = typeof selector === 'string'
        ? this.container.querySelector(selector)
        : selector;
      
      if (element) {
        element.textContent = text;
      }
    }
    
    /**
     * Create DOM element with attributes and content
     * @param {string} tag HTML tag name
     * @param {Object} attrs Element attributes
     * @param {string|Node|Array} content Element content
     * @returns {Element} Created DOM element
     */
    createElement(tag, attrs = {}, content = '') {
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
     * Create event handler with proper this binding
     * @param {Function} handler Event handler function
     * @returns {Function} Bound event handler
     */
    createHandler(handler) {
      return handler.bind(this);
    }
    
    /**
     * Show component
     */
    show() {
      this.container.classList.remove('hidden');
    }
    
    /**
     * Hide component
     */
    hide() {
      this.container.classList.add('hidden');
    }
    
    /**
     * Toggle component visibility
     * @param {boolean} visible Whether the component should be visible
     */
    toggle(visible) {
      this.container.classList.toggle('hidden', !visible);
    }
  }