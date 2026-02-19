import { characterStore } from "../states/character-store.js";

class CharacterSaves extends HTMLElement {
    #shadow = null;
    _nodes = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ 'mode': 'open' });
        this._onStore = this._onStore.bind(this);
    }

    connectedCallback() {
        this.initialRender();
        this.assignNodes();

        characterStore.addEventListener('change', this._onStore);
    }

    disconnectedCallback() {
        if (characterStore) {
            characterStore.removeEventListener('change', this._onStore);
        }
    }

    _onStore({ detail }) {
        ['fort', 'ref', 'will'].forEach(k => {
            this._nodes[`${k}save`].textContent = detail.derived.saves[k];
        });
    }

    assignNodes() {
        this._nodes = {
            fortsave: this.#shadow.getElementById('fortsave'),
            refsave: this.#shadow.getElementById('refsave'),
            willsave: this.#shadow.getElementById('willsave'),
        }
    }

    initialRender() {
        this.#shadow.innerHTML = `
            <table id='character-saves'>
                <thead>
                    <tr>
                        <th>Fortitude</th>
                        <th>Reflex</th>
                        <th>Will</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td id='fortsave'>0</td>
                        <td id='refsave'>0</td>
                        <td id='willsave'>0</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}

customElements.define('character-saves', CharacterSaves);