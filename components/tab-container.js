class TabContainer extends HTMLElement {
    #shadow;
    #panels = [];
    #tabList = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this._onClick = this._onClick.bind(this);
        this.attachShadowMarkup();
    }

    connectedCallback() {
        this._upgradeProperty('selectedIndex');
        this._refreshPanels();
        this.#shadow.addEventListener('click', this._onClick);
        new MutationObserver(() => this._refreshPanels()).observe(this, { childList: true, subtree: false });
    }

    disconnectedCallback() {
        this.#shadow.removeEventListener('click', this._onClick);
    }

    get selectedIndex() { return Number(this.getAttribute('data-selected') || 0); }
    set selectedIndex(v) { this.select(Number(v)); }

    select(indexOrName) {
        const idx = typeof indexOrName === 'number'
            ? indexOrName
            : this.#panels.findIndex(p => p.getAttribute('name') === indexOrName);
        if (idx < 0 || idx >= this.#panels.length) return;
        this.setAttribute('data-selected', String(idx));
        this._applySelection(idx);
        this.dispatchEvent(new CustomEvent('tab-change', { detail: { index: idx } }));
    }

    attachShadowMarkup() {
        this.#shadow.innerHTML = `
      <style>
        :host{display:block}
        .tabs{display:flex;gap:0.25rem;flex-wrap:wrap}
        .tab{cursor:pointer;padding:.25rem .5rem;border:1px solid #ccc;background:#f6f6f6}
        .tab[aria-selected="true"]{background:white;border-bottom:2px solid white;font-weight:600}
        ::slotted(tab-panel){display:block}
        ::slotted(tab-panel[hidden]){display:none}
      </style>
      <div class="tabs" role="tablist"></div>
      <slot></slot>
    `;
        this.#tabList = this.#shadow.querySelector('.tabs');
    }

    _refreshPanels() {
        this.#panels = Array.from(this.querySelectorAll('tab-panel'));
        this.#tabList.innerHTML = '';
        this.#panels.forEach((panel, i) => {
            const title = panel.getAttribute('title') || panel.getAttribute('name') || `Tab ${i + 1}`;
            const btn = document.createElement('button');
            btn.className = 'tab';
            btn.type = 'button';
            btn.textContent = title;
            btn.dataset.index = String(i);
            btn.setAttribute('role', 'tab');
            this.#tabList.appendChild(btn);
        });
        this._applySelection(this.selectedIndex || 0);
    }

    _applySelection(idx) {
        this.#panels.forEach((p, i) => {
            if (i === idx) {
                p.removeAttribute('hidden');
                p.setAttribute('aria-hidden', 'false');
            } else {
                p.setAttribute('hidden', '');
                p.setAttribute('aria-hidden', 'true');
            }
        });
        Array.from(this.#tabList.children).forEach((btn, i) => {
            btn.setAttribute('aria-selected', String(i === idx));
            btn.setAttribute('tabindex', i === idx ? '0' : '-1');
        });
    }

    _onClick(e) {
        const btn = e.target.closest('.tab');
        if (!btn) return;
        this.select(Number(btn.dataset.index));
    }

    _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let val = this[prop];
            delete this[prop];
            this[prop] = val;
        }
    }
}

customElements.define('tab-container', TabContainer);
