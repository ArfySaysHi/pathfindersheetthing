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
        const val = this.#shadow.getElementById('valinput').value;
        characterStore.patchPointBuy({ str: val });
        characterStore.save();
    }

    connectedCallback() {
        this.initialRender();
        this.assignNodes();

        this._nodes.testbtn.addEventListener('mousedown', this.handleTestBtn);

        try {
            const char_id = window.location.pathname.split("/").pop();
            const character = this.getCharacterById(char_id);
            characterStore.set(character);
        } catch (err) {
            console.error(err);
        }
    }

    disconnectedCallback() {
        if (this._nodes.testbtn) {
            this._nodes.testbtn.removeEventListener('mousedown', this.handleTestBtn);
        }
    }

    initialRender() {
        this.#shadow.innerHTML = `
      <style>
        table { border-collapse: collapse; }
        td { padding: 4px 8px; }
      </style>
      <div>
        <input id="valinput" type="number" />
        <button id="testbtn">Click Me</button>
        <div class="character-sheet">
            <div id="char-id"></div>
            <ability-scores></ability-scores>
            <skill-table></skill-table>
            <mod-form id="mod-form"></mod-form>
          </div>
        </div>
      </div>
    `;
    }

    assignNodes() {
        this._nodes = {
            charId: this.#shadow.getElementById("char-id"),
            modForm: this.#shadow.getElementById("mod-form"),
            testbtn: this.#shadow.getElementById("testbtn")
        };
    }
}

customElements.define("character-sheet", CharacterSheet);
