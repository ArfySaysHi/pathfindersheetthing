const defaultChar = {
    id: 0,
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
        localStorage.clear();
        const characters = JSON.parse(localStorage.getItem('characters'));
        console.log(characters);
        if (!characters || (Array.isArray(characters) && characters.length === 0)) {
            localStorage.setItem('characters', JSON.stringify([defaultChar]));
            goto(`/character/${0}`)
        } else if (Array.isArray(characters) && characters.length > 0) {
            localStorage.setItem('characters', JSON.stringify([...characters, { ...defaultChar, id: characters.length }]));
            goto(`/character/${characters.length}`);
        }
    }

    connectedCallback() {
        this.#shadow.getElementById('new-character').addEventListener('click', this.createCharacter.bind(this));
    }

    disconnectedCallback() {
        this.#shadow.getElementById('new-character').removeEventListener('click', this.createCharacter.bind(this));
    }

    render() {
        this.#shadow.innerHTML = `
        <div>
            <button id='new-character'>New Character</button>
            <ul>
            </ul>
        </div>
        `;
    }
}

customElements.define('character-list', CharacterList);