import { itemStore } from "../../states/item-store.js";

class ItemTab extends HTMLElement {
    #shadow = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.initialRender();
        const items = itemStore.getState();
        this.#shadow.getElementById('itemlist').append(items.map(i => `<li>${i.name}</li>`).join(''));
    }

    initialRender() {
        this.#shadow.innerHTML = `
            <div>
                <mod-form id='modform'></mod-form>
                <ul id='itemlist'></ul>
            </div>
        `;
    }

}

customElements.define('item-tab', ItemTab);