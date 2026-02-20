import { characterStore } from "../states/character-store.js";

class AbilityScores extends HTMLElement {
    #shadow = null;
    _nodes = {};

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
    }

    assignNodes() {
        this._nodes = {
            score: {
                str: this.#shadow.getElementById("str-score"),
                dex: this.#shadow.getElementById("dex-score"),
                con: this.#shadow.getElementById("con-score"),
                int: this.#shadow.getElementById("int-score"),
                wis: this.#shadow.getElementById("wis-score"),
                cha: this.#shadow.getElementById("cha-score"),
            },
            mod: {
                str: this.#shadow.getElementById("str-mod"),
                dex: this.#shadow.getElementById("dex-mod"),
                con: this.#shadow.getElementById("con-mod"),
                int: this.#shadow.getElementById("int-mod"),
                wis: this.#shadow.getElementById("wis-mod"),
                cha: this.#shadow.getElementById("cha-mod"),
            }
        }
    }

    connectedCallback() {
        this.initialRender();
        this.assignNodes();
        this.updateFromStore(characterStore.getState());

        this.onStore = (e) => this.updateFromStore(e.detail);
        characterStore.addEventListener("change", this.onStore);
    }

    disconnectedCallback() {
        if (this.onStore) {
            characterStore.removeEventListener('change', this.onStore);
        }
    }

    initialRender() {
        this.#shadow.innerHTML = `
          <div class="ability-scores">
            <table>
              <tr><td>STR</td><td id="str-score"></td><td id="str-mod"></td></tr>
              <tr><td>DEX</td><td id="dex-score"></td><td id="dex-mod"></td></tr>
              <tr><td>CON</td><td id="con-score"></td><td id="con-mod"></td></tr>
              <tr><td>INT</td><td id="int-score"></td><td id="int-mod"></td></tr>
              <tr><td>WIS</td><td id="wis-score"></td><td id="wis-mod"></td></tr>
              <tr><td>CHA</td><td id="cha-score"></td><td id="cha-mod"></td></tr>
            </table>
       `;
    }

    updateFromStore(state = {}) {
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(key => {
            this._nodes.score[key].textContent = state.derived.abilityScores[key];
            this._nodes.mod[key].textContent = state.derived.abilityMods[key];
        })
    }
}

customElements.define('ability-scores', AbilityScores);