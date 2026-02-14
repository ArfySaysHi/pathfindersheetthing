const defaultChar = {
    id: '0',
    info: {
        name: 'Name',
        alignment: 'True Neutral',
        race: 'Human',
        deity: 'None',
        age: 30,
        gender: 'Any',
        height: '5ft',
        weight: '65kg',
        eyes: 'brown',
        hair: 'brown',
        description: '',
        languages: []
    },
    pointBuy: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
    },
    inventory: [],
    feats: [],
    skills: [],
    spells: [],
    currentXp: 0,
    classes: [],
};

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
            localStorage.setItem('characters', JSON.stringify([defaultChar]));
            goto(`/character/${0}`)
        } else if (Array.isArray(characters) && characters.length > 0) {
            const newId = `${Number(characters[characters.length - 1].id) + 1}`
            localStorage.setItem('characters', JSON.stringify([...characters, { ...defaultChar, id: newId }]));
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
            output += `<li>${c.info.name}</li>`
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