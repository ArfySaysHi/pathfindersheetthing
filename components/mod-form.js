import { characterStore } from "/pathfindersheetthing/states/character-store.js";

class ModForm extends HTMLElement {
    #shadow = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.handleSubmit = this.handleSubmit.bind(this);
        this.newMod = this.newMod.bind(this);
    }

    static define(tag = 'mod-form') {
        customElements.define(tag, this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let newObj = {};
        data.forEach((v, a) => newObj[a] = v);
        console.log("Rework form to store data in attribute, FormData is a bit clunky to use here.");
    }

    newMod(e) {
        e.preventDefault();
        const ref = this.#shadow.getElementById('mod-list');
        const num = ref.childElementCount;

        ref.innerHTML += `<li>
            <label for='mod${num}'>Value</label>
            <input type='number' name='mod${num}' />
            <label for='target${num}'>Target</label>
            <input type='text' name='target${num}' />
        </li>`;
    }

    connectedCallback() {
        this.onStore = e => this.render(e.detail);
        characterStore.addEventListener('change', this.onStore)
        this.render(characterStore.getState());

        this.#shadow.getElementById('mod-form').addEventListener('submit', this.handleSubmit)
        this.#shadow.getElementById('new-mod').addEventListener('mousedown', this.newMod);
    }

    disconnectedCallback() {
        characterStore.removeEventListener('change', this.onStore);
        this.#shadow.getElementById('mod-form').removeEventListener('submit', this.handleSubmit);
        this.#shadow.getElementById('new-mod').removeEventListener('mousedown', this.newMod);
    }

    render(state) {
        this.#shadow.innerHTML = `
            <form id='mod-form'>
                <label for="modname">Name:</label><br />
                <input type='text' id='modname' name='modname' />
                <button id='new-mod' type='button'>+</button>
                <ul id='mod-list'>
                </ul>
                <button>Submit</button>
            </form>
        `
    }
}

ModForm.define();