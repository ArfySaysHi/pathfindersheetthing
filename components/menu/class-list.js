import { classStore } from "../../states/class-store.js";

class ClassList extends HTMLElement {
    #shadow = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this._onClassStore = this._onClassStore.bind(this);
        this._onDragStart = this._onDragStart.bind(this);
    }

    connectedCallback() {
        this.render(classStore.getState());

        classStore.addEventListener('change', this._onClassStore);
        this.#shadow.addEventListener('dragstart', this._onDragStart);
    }

    disconnectedCallback() {
        classStore.removeEventListener('change', this._onClassStore);
        this.#shadow.removeEventListener('dragstart', this._onDragStart);
    }

    _onDragStart(e) {
        const li = e.target.closest('li');
        if (!li) return;
        const id = li.id.replace('class-', '');
        const payload = classStore.getState().find(c => c.name.toLowerCase() === id);
        e.dataTransfer.setData('application/json', JSON.stringify({ action: 'add-class', payload }));
    }

    _onClassStore(e) { this.render(e.detail); }

    render(classes) {
        this.#shadow.innerHTML = `
            <ul>
                ${classes.map(c => `<li id='class-${c.name.toLowerCase()}' draggable='true'>${c.name} ${c.bab} ${c.fort} ${c.ref} ${c.will}</li>`)}
            </ul>
        `;
    }
}

customElements.define('class-list', ClassList);