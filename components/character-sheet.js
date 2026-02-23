import { characterStore } from "/pathfindersheetthing/states/character-store.js";

class CharacterSheet extends HTMLElement {
    #shadow;
    _nodes = null;
    onStore = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "open" });
        this.handleSave = this.handleSave.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onStore = this._onStore.bind(this);
        this._onDragOver = this._onDragOver.bind(this);
        this._onDrop = this._onDrop.bind(this);
    }

    _onStore() {
        const character = characterStore.getState();
        const portrait = this.#shadow.getElementById('bento-portrait');
        if (character && portrait) {
            const currUrl = portrait.getAttribute('src');
            if (currUrl !== character.info.art) portrait.setAttribute('src', character.info.art);
        }
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

    _onClick(e) {
        if (e.target?.dataset?.action === 'add-art-url') {
            const url = prompt("Enter URL for the image:");
            if (!url) return;
            const character = characterStore.getState();
            characterStore.set({ info: { ...character.info, art: url } });
            characterStore.save();
        }
    }

    connectedCallback() {
        try {
            const char_id = window.location.pathname.split("/").pop();
            const character = this.getCharacterById(char_id);
            characterStore.set(character);
        } catch (err) {
            console.error(err);
        }

        this.initialRender();
        this.assignNodes();

        this._nodes.savebtn.addEventListener('mousedown', this.handleSave);
        this._nodes.portrait.addEventListener('click', this._onClick);
        characterStore.addEventListener('change', this._onStore);
        this._nodes.bentosheet.addEventListener('dragover', this._onDragOver);
        this._nodes.bentosheet.addEventListener('drop', this._onDrop);
    }

    disconnectedCallback() {
        if (this._nodes.savebtn) {
            this._nodes.savebtn.removeEventListener('mousedown', this.handleSave);
        }
        if (this._nodes.portrait) {
            this._nodes.portrait.removeEventListener('click', this._onClick);
        }
        characterStore.removeEventListener('change', this._onStore);
        if (this._nodes.bentosheet) {
            this._nodes.bentosheet.removeEventListener('dragover', this._onDragOver);
            this._nodes.bentosheet.removeEventListener('drop', this._onDrop);
        }
    }

    _onDragOver(e) {
        e.preventDefault();
    }

    _onDrop(e) {
        e.preventDefault();
        const raw = e.dataTransfer.getData('application/json');
        if (!raw) return;
        const { action, payload } = JSON.parse(raw);

        if (action === 'add-class') characterStore.addClass(payload);
    }

    initialRender() {
        this.#shadow.innerHTML = `
        <style>
            .character-sheet {
                display: grid;
                grid-template-columns: 1fr 0.25fr;            
            }

            .bento-sheet {
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
                object-position: top;
                max-height: 35vh;
                cursor: pointer;
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
            <div id='bento-sheet' class='bento-sheet'>
                <section class='bento-image'>
                    <img id='bento-portrait' class='bento-portrait' data-action='add-art-url' src='${characterStore.getState().info.art}' />
                    <character-classes></character-classes>
                    <ability-scores></ability-scores>
                    <character-ac></character-ac>
                    <character-saves></character-saves>
                    <character-cm></character-cm>
                </section>
                <section class='bento-section-primary'>
                    <tab-container id="tabs">
                        <tab-panel name="biography" title='Biography'>
                            Character info inputs go here...
                        </tab-panel>
                        <tab-panel name="skills" title="Skills">
                            <skill-table></skill-table>
                        </tab-panel>
                        <tab-panel name="items" title="Items">
                            <item-tab></item-tab>
                        </tab-panel>
                        <tab-panel name='feats' title='Feats'>
                            Feats go here...
                        </tab-panel>
                        <tab-panel name='classfeatures' title='Class Features'>
                            Much much later, class feature listing
                        </tab-panel>
                    </tab-container>
                </section>
            </div>
            <div id='context-menu' class='context-menu'>
                <class-form></class-form>
                <class-list></class-list>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    assignNodes() {
        this._nodes = {
            modForm: this.#shadow.getElementById("mod-form"),
            savebtn: this.#shadow.getElementById("savebtn"),
            portrait: this.#shadow.getElementById("bento-portrait"),
            bentosheet: this.#shadow.getElementById('bento-sheet')
        };
    }
}

customElements.define("character-sheet", CharacterSheet);
