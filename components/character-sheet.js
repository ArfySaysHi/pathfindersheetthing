import { characterStore } from "/pathfindersheetthing/states/character-store.js";

class CharacterSheet extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    getCharacterById(id) {
        const characters = JSON.parse(localStorage.getItem('characters'));

        if (!characters) throw Error("No characters");
        if (!Array.isArray(characters)) throw Error("Characters does not contain a valid array");
        if (characters.length === 0) throw Error("Characters is empty.");

        const c = characters.find(c => c.id === id);
        if (c) return c;

        throw Error("No character with that ID");
    }

    connectedCallback() {
        const char_id = window.location.pathname.split('/').pop();
        const character = this.getCharacterById(char_id);
        characterStore.set(character);

        this.onStore = e => this.render(e.detail);
        characterStore.addEventListener('change', this.onStore);
        this.render(characterStore.getState());
        this.#shadow.getElementById('testbtn').addEventListener('click', this.test.bind(this));
    }

    disconnectedCallback() {
        this.#shadow.getElementById('testbtn').removeEventListener('click', this.test.bind(this));
    }

    test() {
        console.log("me triggered now");
    }

    render(state) {
        if (!state) return '';

        this.#shadow.innerHTML = `
            <div>
                <button id='testbtn'>Click Me</button>
                <div class='character-sheet'>
                    <div>${state.id}</div>
                    <div class='ability-scores'>
                        <table>
                            <tr>
                                <td>STR</td>
                                <td>${state.pointBuy.str}</td>
                            </tr>
                            <tr>
                                <td>DEX</td>
                                <td>${state.pointBuy.dex}</td>
                            </tr>
                            <tr>
                                <td>CON</td>
                                <td>${state.pointBuy.con}</td>
                            </tr>
                            <tr>
                                <td>INT</td>
                                <td>${state.pointBuy.int}</td>
                            </tr>
                            <tr>
                                <td>WIS</td>
                                <td>${state.pointBuy.wis}</td>
                            </tr>
                            <tr>
                                <td>CHA</td>
                                <td>${state.pointBuy.cha}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('character-sheet', CharacterSheet);