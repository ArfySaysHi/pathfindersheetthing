const MOD_TYPES = [
    'Untyped', 'Alchemical', 'Armor', 'Circumstance', 'Competence', 'Deflection', 'Dodge',
    'Enhancement', 'Inherent', 'Insight', 'Luck', 'Morale', 'Natural Armor', 'Profane',
    'Resistance', 'Sacred', 'Shield', 'Size'
];

class ModForm extends HTMLElement {
    #shadow = null;
    #name = '';
    #type = 'Item';
    #mods = [];

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });

        this.$form = null;
        this.$list = null;

        this.handleSubmit = this.handleSubmit.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onInput = this._onInput.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    get name() { return this.#name; }
    set name(val) { this.#name = String(val || ''); }

    get type() { return this.#type; }
    set type(val) { this.#type = String(val || 'Item'); }

    get mods() { return this.#mods.slice(); }
    set mods(val) {
        this.#mods = Array.isArray(val) ? val.map(m => ({ type: 'Untyped', target: '', value: '', ...m })) : [];
        if (this.$list) this.renderList();
    }

    addMod(mod = { type: 'Untyped', target: '', value: '' }) {
        this.#mods = [...this.#mods, { type: 'Untyped', target: '', value: '', ...mod }];
        this.renderList();
        this._emitUpdate();
    }

    removeMod(idx) {
        const i = Number.parseInt(idx, 10);
        if (Number.isNaN(i) || i < 0 || i >= this.#mods.length) return;
        this.#mods = this.#mods.filter((_, j) => j !== i);
        this.renderList();
        this._emitUpdate();
    }

    alterMod(idx, alteredVal) {
        const i = Number.parseInt(idx, 10);
        if (Number.isNaN(i) || i < 0 || i >= this.#mods.length) return;
        this.#mods = this.#mods.map((m, j) => j === i ? { ...m, ...alteredVal } : m);
        this._updateListItem(i);
        this._emitUpdate();
    }

    handleSubmit(e) {
        e.preventDefault();
        const payload = { name: this.#name, type: this.#type, mods: this.#mods.slice() };
        this.dispatchEvent(new CustomEvent('modform-submit', { detail: payload }));
        console.log('ModForm submit', payload);
    }

    newMod() { this.addMod(); }

    _onChange(e) {
        const el = e.target;
        if (!(el instanceof HTMLElement) || !el.dataset?.action) return;

        const action = el.dataset.action;
        if (action === 'typeselect' && el.tagName === 'SELECT') {
            this.type = el.value;
            this.dispatchEvent(new CustomEvent('modform-typechange', { detail: { type: this.type } }));
        } else if (action === 'mod-type' && el.tagName === 'SELECT') {
            this.alterMod(el.dataset.index, { type: el.value });
        }
    }

    _onClick(e) {
        const el = e.target;
        if (!(el instanceof HTMLElement) || !el.dataset?.action) return;

        const action = el.dataset.action;
        const idx = el.dataset.index ? Number.parseInt(el.dataset.index, 10) : undefined;

        if (action === 'new') {
            this.newMod();
        } else if (action === 'remove' && idx !== undefined && !Number.isNaN(idx)) {
            this.removeMod(idx);
        }
    }

    _onInput(e) {
        const el = e.target;
        if (!(el instanceof HTMLElement) || !el.dataset?.action) return;

        const action = el.dataset.action;
        if (action === 'name') {
            this.name = (el.value || '').trim();
        } else if (action === 'mod-target' || action === 'mod-value') {
            const idx = Number.parseInt(el.dataset.index, 10);
            const attr = el.dataset.attribute;
            const val = el.value;
            if (!Number.isNaN(idx) && attr) this.alterMod(idx, { [attr]: val });
        }
    }

    connectedCallback() {
        this.#shadow.innerHTML = `
      <form id="mod-form">
        <label for="modname">Name:</label>
        <input type="text" data-action="name" id="modname" name="modname" />
        <select id="typeselect" data-action="typeselect">
          <option>Item</option>
          <option>Feat</option>
        </select>
        <button type="button" data-action="new">+</button>
        <ul id="mod-list" aria-live="polite"></ul>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    `;

        this.$form = this.#shadow.getElementById('mod-form');
        this.$list = this.#shadow.getElementById('mod-list');

        this.#shadow.addEventListener('change', this._onChange);
        this.#shadow.addEventListener('click', this._onClick);
        this.#shadow.addEventListener('input', this._onInput);
        this.#shadow.addEventListener('submit', this.handleSubmit);

        this.renderList();
    }

    disconnectedCallback() {
        this.#shadow.removeEventListener('change', this._onChange);
        this.#shadow.removeEventListener('click', this._onClick);
        this.#shadow.removeEventListener('input', this._onInput);
        this.#shadow.removeEventListener('submit', this.handleSubmit);
    }

    renderList() {
        const frag = document.createDocumentFragment();
        this.#mods.forEach((m, i) => frag.appendChild(this._createListItem(m, i)));
        this.$list.innerHTML = '';
        this.$list.appendChild(frag);
    }

    _createListItem(mod, index) {
        const li = document.createElement('li');
        li.dataset.index = String(index);

        const target = document.createElement('input');
        target.type = 'text';
        target.value = mod.target ?? '';
        target.dataset.action = 'mod-target';
        target.dataset.attribute = 'target';
        target.dataset.index = String(index);
        target.setAttribute('aria-label', `modifier ${index} target`);

        const value = document.createElement('input');
        value.type = 'text';
        value.value = mod.value ?? '';
        value.dataset.action = 'mod-value';
        value.dataset.attribute = 'value';
        value.dataset.index = String(index);
        value.setAttribute('aria-label', `modifier ${index} value`);

        const select = document.createElement('select');
        select.dataset.action = 'mod-type';
        select.dataset.attribute = 'type';
        select.dataset.index = String(index);
        MOD_TYPES.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            if (t === (mod.type ?? 'Untyped')) opt.selected = true;
            select.appendChild(opt);
        });

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'x';
        btn.dataset.action = 'remove';
        btn.dataset.index = String(index);
        btn.setAttribute('aria-label', `remove modifier ${index}`);

        li.appendChild(target);
        li.appendChild(value);
        li.appendChild(select);
        li.appendChild(btn);

        return li;
    }

    _updateListItem(i) {
        const li = this.$list.children[i];
        if (!li) return;
        const m = this.#mods[i];
        const target = li.querySelector('input[data-action="mod-target"]');
        const val = li.querySelector('input[data-action="mod-value"]');
        const sel = li.querySelector('select[data-action="mod-type"]');
        if (target && target.value !== m.target) target.value = m.target ?? '';
        if (val && val.value !== m.value) val.value = m.value ?? '';
        if (sel && sel.value !== m.type) sel.value = m.type ?? 'Untyped';
    }

    _emitUpdate() {
        this.dispatchEvent(new CustomEvent('mods-updated', { detail: this.#mods.slice() }));
    }
}

customElements.define('mod-form', ModForm);
