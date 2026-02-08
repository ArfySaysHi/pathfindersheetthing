class CharacterList extends HTMLElement {
    #shadow;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.#shadow.innerHTML = `
            <ul>
                <li onclick="goto('/character')">Big Jeff</li>
                <li>Small Jeff</li>
                <li>Medium Jeff</li>
            </ul>
        `;
    }
}

customElements.define('character-list', CharacterList);