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
            }

            .bento-image {
                grid-column: span 3;
                grid-row: span 2;
                min-width: 200px;
            }

            .bento-portrait {
                display: block;
                width: 100%;
                object-fit: cover;
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
                    <img class='bento-portrait' src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fm%2Fb1FVT2wFB6IAAAAC%2Fhand-on-shoulder.gif&f=1&nofb=1&ipt=c7f2bb2b87598633a4beade8b18d357e5a765adbd153f09624883d18c6c4f97d' />
                    <character-ac></character-ac>
                    <character-saves></character-saves>
                    <character-cm></character-cm>
                </section>
                <section class='bento-section-secondary'>
                    <ability-scores></ability-scores>
                </section>
                <section class='bento-section-primary'>
                    <tab-container id="tabs">
                        <tab-panel name="skills" title="Skills">
                            <skill-table></skill-table>
                        </tab-panel>
                        <tab-panel name="items" title="Items">
                            <mod-form id="mod-form"></mod-form>
                        </tab-panel>
                    </tab-container>
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
