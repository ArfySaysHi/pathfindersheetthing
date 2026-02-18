class CharacterList extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    createCharacter() {
        const characters = JSON.parse(localStorage.getItem('characters'));
        if (!characters || (Array.isArray(characters) && characters.length === 0)) {
            goto(`/character/${0}`)
        } else if (Array.isArray(characters) && characters.length > 0) {
            goto(`/character/${characters.length}`);
        }
    }

    connectedCallback() {
        this.#shadow.getElementById('new-character').addEventListener('click', this.createCharacter.bind(this));
    }

    disconnectedCallback() {
        this.#shadow.getElementById('new-character').removeEventListener('click', this.createCharacter.bind(this));
    }

    renderCharacterIndex() {
        const characters = JSON.parse(localStorage.getItem('characters'));

        if (!characters || !Array.isArray(characters)) return;

        let output = '';
        characters.forEach(c => {
            output += `<li onclick='goto("/character/${c.id}");'>${c.info.name}</li>`
        });

        return output;
    }

    render() {
        this.#shadow.innerHTML = `
        <div>
            <button id='new-character'>New Character</button>
            <ul>
                ${this.renderCharacterIndex()}
            </ul>
        </div>
        `;
    }
}

customElements.define('character-list', CharacterList);