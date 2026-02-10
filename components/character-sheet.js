import { characterStore } from "/pathfindersheetthing/states/character-store.js";

class CharacterSheet extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
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