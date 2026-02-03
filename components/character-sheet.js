class CharacterSheet extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.#shadow.innerHTML = `
            <div>SHEET GOES HERE</div>
        `;
    }
}

customElements.define('character-sheet', CharacterSheet);