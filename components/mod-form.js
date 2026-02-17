import { characterStore } from '../states/character-store.js';

class ModForm extends HTMLElement {
    #shadow = null;
    #mods = [];

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });

        this.$form = null;
        this.$list = null;

        this.handleSubmit = this.handleSubmit.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onInput = this._onInput.bind(this);
        this._onStore = this._onStore?.bind(this);
    }

    get mods() {
        return this.#mods;
    }

    set mods(val) {
        this.#mods = val;
        if (this.$list) this.renderList();
    }

    addMod(mod = { type: '', target: '', value: '' }) {
        this.#mods = [...this.#mods, mod];
        if (this.$list) this.renderList();
    }

    removeMod(idx) {
        const i = Number(idx);
        this.#mods = this.#mods.filter((_, j) => j !== i);
        if (this.$list) this.renderList();
    }

    alterMod(idx, alteredVal) {
        const i = Number(idx);
        this.#mods = this.#mods.map((m, j) => j === i ? { ...m, ...alteredVal } : m);
    }

    // TODO: Limit what modifiers can be
    // TODO: Attach modifiers to items from an inventory or a skill or whatever
    handleSubmit(e) {
        e.preventDefault();
        const { mods } = characterStore.getState();
        characterStore.set({ 'mods': [...mods, ...this.#mods] });
        console.log(characterStore.getState());
    }

    newMod() {
        this.addMod();
    }

    _onClick(e) {
        const el = e.composedPath().find(n => n instanceof HTMLElement && n.dataset?.action);
        if (!el) return;
        const action = el.dataset.action;
        const idx = el.dataset.index ? Number(el.dataset.index) : undefined;

        if (action === 'new') {
            this.newMod();
        } else if (action === 'remove' && idx !== undefined) {
            this.removeMod(idx);
        }
    }

    _onInput(e) {
        const el = e.composedPath().find(n => n instanceof HTMLElement && n.dataset?.action);
        if (!el) return;
        const idx = Number(el.dataset.index);
        const attr = el.dataset.attribute;
        const val = el.value;

        this.alterMod(idx, { [attr]: val });

        const li = this.$list.children[idx];
        if (li) {
            const input = li.querySelector(`input[data-attribute="${attr}"]`);
            if (input && input !== el && input.value !== val) input.value = val;
        }
    }

    connectedCallback() {
        this.#shadow.innerHTML = `
      <form id='mod-form'>
        <label for='modname'>Name:</label><br />
        <input type='text' id='modname' name='modname' />
        <button type='button' data-action='new' data-index=''>+</button>
        <ul id='mod-list'></ul>
        <button type='submit'>Submit</button>
      </form>
    `;

        this.$form = this.#shadow.getElementById('mod-form');
        this.$list = this.#shadow.getElementById('mod-list');

        this.#shadow.addEventListener('click', this._onClick);
        this.#shadow.addEventListener('input', this._onInput);
        this.#shadow.addEventListener('submit', this.handleSubmit);

        this.renderList();
    }

    disconnectedCallback() {
        this.#shadow.removeEventListener('click', this._onClick);
        this.#shadow.removeEventListener('input', this._onInput);
        this.#shadow.removeEventListener('submit', this.handleSubmit);
    }

    renderList() {
        this.$list.innerHTML = this.#mods.map((v, i) => `
      <li data-index='${i}'>
        <input type='text' data-action='change' data-attribute='target' data-index='${i}' value='${encodeURIComponent(v.target)}' />
        <input type='text' data-action='change' data-attribute='value' data-index='${i}' value='${encodeURIComponent(v.value)}' />
        <button type='button' class='remove' data-action='remove' data-index='${i}'>x</button>
      </li>
    `).join('');

        Array.from(this.$list.children).forEach((li, i) => {
            li.dataset.index = String(i);
            li.querySelectorAll('[data-index]').forEach(n => n.dataset.index = String(i));
        });
    }
}

customElements.define('mod-form', ModForm);
