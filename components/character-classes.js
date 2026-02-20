import { characterStore } from '../states/character-store.js';

class CharacterClasses extends HTMLElement {
    #shadow = null;
    _nodes = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this._onStore = this._onStore.bind(this);
    }

    connectedCallback() {
        this.render(characterStore.getState());

        characterStore.addEventListener('change', this._onStore);
    }

    disconnectedCallback() {
        characterStore.removeEventListener('change', this._onStore);
    }

    _onStore(e) {
        this.render(e.detail);
    }

    render(state = {}) {
        this.#shadow.innerHTML = `
            <section class='character-classes'>
                <div>Classes</div>
                <ul id='class-list'>
                    ${state.classes.map(c => `<li>${c.name} ${c.level}</li>`).join('')}
                </ul>
            </section>
        `;
    }
}

customElements.define('character-classes', CharacterClasses);