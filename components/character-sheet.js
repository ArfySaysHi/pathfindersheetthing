import { characterStore } from "/pathfindersheetthing/states/character-store.js";

class CharacterSheet extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.onStore = e => this.render(e.detail);
        characterStore.addEventListener('change', this.onStore);
        this.render(characterStore.getState());
    }

    render(state) {
        this.#shadow.innerHTML = `
            <div>
                ${JSON.stringify(state)}
            </div>
        `;
    }
}

customElements.define('character-sheet', CharacterSheet);