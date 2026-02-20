class CharacterAc extends HTMLElement {
    #shadow = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.initialRender();
    }

    initialRender() {
        this.#shadow.innerHTML = `
            <style>
                :host {
                    margin: 0;
                    padding: 0;
                    display: block;
                }

                table {
                    width: 100%;
                    table-layout: fixed;
                }

                td {
                    text-align: center;
                }
            </style>
            <table id='character-ac'>
                <thead>
                    <tr>
                        <th>AC</th>
                        <th>Touch</th>
                        <th>Flatfooted</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>10</td>
                        <td>10</td>
                        <td>10</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}

customElements.define('character-ac', CharacterAc);