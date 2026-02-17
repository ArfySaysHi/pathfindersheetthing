import { characterStore } from "/pathfindersheetthing/states/character-store.js";

class CharacterSheet extends HTMLElement {
    #shadow;
    _nodes = null;
    onStore = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "open" });
        this.handleTestBtn = this.handleTestBtn.bind(this);
    }

    getCharacterById(id) {
        const characters = JSON.parse(localStorage.getItem("characters"));
        if (!characters) {
            characterStore.set({ id });
            const char = characterStore.getState();
            localStorage.setItem('characters', JSON.stringify([char]))
            return char;
        }
        const c = characters.find((c) => c.id === id);
        if (c) return c;

        characterStore.set({ id });
        localStorage.setItem('characters', JSON.stringify([...characters, characterStore.getState()]))
    }

    handleTestBtn() {
        characterStore.patchPointBuy({ str: 9 });
        characterStore.save();
    }

    connectedCallback() {
        this.#shadow.innerHTML = `
      <style>
        table { border-collapse: collapse; }
        td { padding: 4px 8px; }
      </style>
      <div>
        <input id="valinput" type="text" />
        <button id="testbtn">Click Me</button>
        <div class="character-sheet">
          <div id="char-id"></div>
          <div class="ability-scores">
            <table>
              <tr><td>STR</td><td id="str-score"></td><td id="str-mod"></td></tr>
              <tr><td>DEX</td><td id="dex-score"></td><td id="dex-mod"></td></tr>
              <tr><td>CON</td><td id="con-score"></td><td id="con-mod"></td></tr>
              <tr><td>INT</td><td id="int-score"></td><td id="int-mod"></td></tr>
              <tr><td>WIS</td><td id="wis-score"></td><td id="wis-mod"></td></tr>
              <tr><td>CHA</td><td id="cha-score"></td><td id="cha-mod"></td></tr>
            </table>
            <mod-form id="mod-form"></mod-form>
          </div>
        </div>
      </div>
    `;

        this._nodes = {
            charId: this.#shadow.getElementById("char-id"),
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
            },
            modForm: this.#shadow.getElementById("mod-form"),
            testbtn: this.#shadow.getElementById("testbtn")
        };

        this.onStore = (e) => this.updateFromStore(e.detail);
        characterStore.addEventListener("change", this.onStore);

        this._nodes.testbtn.addEventListener('mousedown', this.handleTestBtn);

        try {
            const char_id = window.location.pathname.split("/").pop();
            const character = this.getCharacterById(char_id);
            characterStore.set(character);
        } catch (err) {
            console.error(err);
        }

        this.updateFromStore(characterStore.getState());
    }

    disconnectedCallback() {
        if (this.onStore) {
            characterStore.removeEventListener("change", this.onStore);
        }

        if (this._nodes.testbtn) {
            this._nodes.testbtn.removeEventListener('mousedown', this.handleTestBtn);
        }
    }

    updateFromStore(state = {}) {
        if (!state) return;

        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(key => {
            this._nodes.score[key].textContent = characterStore.getState().derived.abilityScores[key];
        })
    }

    render(state) {
        this.updateFromStore(state);
    }
}

customElements.define("character-sheet", CharacterSheet);
