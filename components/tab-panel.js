class TabPanel extends HTMLElement {
    constructor() { super(); }
    connectedCallback() {
        if (!this.hasAttribute('role')) this.setAttribute('role', 'tabpanel');
    }
}

customElements.define('tab-panel', TabPanel);