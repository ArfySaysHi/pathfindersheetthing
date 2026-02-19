import { characterStore } from "/pathfindersheetthing/states/character-store.js";

class CharacterSheet extends HTMLElement {
    #shadow;
    _nodes = null;
    onStore = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "open" });
        this.handleSave = this.handleSave.bind(this);
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

    handleSave() {
        characterStore.save();
    }

    connectedCallback() {
        this.initialRender();
        this.assignNodes();

        this._nodes.savebtn.addEventListener('mousedown', this.handleSave);

        try {
            const char_id = window.location.pathname.split("/").pop();
            const character = this.getCharacterById(char_id);
            characterStore.set(character);
        } catch (err) {
            console.error(err);
        }
    }

    disconnectedCallback() {
        if (this._nodes.savebtn) {
            this._nodes.savebtn.removeEventListener('mousedown', this.handleSave);
        }
    }

    initialRender() {
        this.#shadow.innerHTML = `
        <style>
            .bento {
                display: grid;
                grid-template-columns: repeat(12, minmax(0, 1fr));
                grid-template-rows: repeat(12, minmax(0, 1fr));
                grid-auto-flow: dense;
                gap: 1rem;
            }

            .bento-image {
                grid-column: span 3;
                grid-row: span 1;
            }

            .bento-portrait {
                width: 100%;
                height: 100%;
                object-fit: cover;
                min-width: 200px;
            }

            .bento-section-primary {
                grid-column: span 6;
                grid-row: span 4;
            }

            .bento-section-secondary {
                grid-column: span 3;
                grid-row: span 4;
            }

            .bento-section-tertiary {
                grid-column: span 3;
                grid-row: span 2;
            }
        </style>
      <div>
        <button id="savebtn">Save</button>
        <div class="character-sheet">
            <div class='bento'>
                <section class='bento-image'>
                    <img class='bento-portrait' src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fp__%2Fimages%2Fb%2Fbd%2FMoe%252C....png%2Frevision%2Flatest%3Fcb%3D20190709142405%26path-prefix%3Dprotagonist&f=1&nofb=1&ipt=a60d834b569924c10c08f5465cb187513bc5e2d31c5c97c0e3df3b6eec09d391' />
                </section>
                <section class='bento-section-secondary'>
                    <ability-scores></ability-scores>
                    <character-saves></character-saves>
                </section>
                <section class='bento-section-primary'>
                    <skill-table></skill-table>
                </section>
                <section class='bento-section-primary'>
                    <mod-form id="mod-form"></mod-form>
                </section>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    assignNodes() {
        this._nodes = {
            modForm: this.#shadow.getElementById("mod-form"),
            savebtn: this.#shadow.getElementById("savebtn")
        };
    }
}

customElements.define("character-sheet", CharacterSheet);
