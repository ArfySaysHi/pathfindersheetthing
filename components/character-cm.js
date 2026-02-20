class CharacterCm extends HTMLElement {
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
            <table id='character-cm'>
                <thead>
                    <tr>
                        <th>CMB</th>
                        <th>CMD</th>
                        <th>FCMD</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}

customElements.define('character-cm', CharacterCm);