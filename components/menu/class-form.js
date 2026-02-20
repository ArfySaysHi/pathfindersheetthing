import { classStore } from '../../states/class-store.js';

class ClassForm extends HTMLElement {
    #shadow = null;
    _nodes = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this._onSubmit = this._onSubmit.bind(this);
    }

    connectedCallback() {
        this.render();
        this.attachNodes();

        this._nodes['class-form'].addEventListener('submit', this._onSubmit);
    }

    disconnectedCallback() {
        if (this._nodes['class-form']) this._nodes['class-form'].removeEventListener('submit', this._onSubmit);
    }

    _onSubmit(e) {
        e.preventDefault();
        let newClass = { level: 1 };
        Object.keys(this._nodes.inputs).forEach(k => {
            newClass[k] = this._nodes.inputs[k].value;
        });

        classStore.add(newClass);
    }

    render() {
        this.#shadow.innerHTML = `
            <form id='class-form'>
                <input id='name' name='name' type='text' />
                <select id='hitdie' name='hitdie'>
                    <option>1d6</option>
                    <option>1d8</option>
                    <option>1d10</option>
                    <option>1d12</option>
                </select>
                <select id='bab' name='bab'>
                    <option>0.5</option>
                    <option>0.75</option>
                    <option>1</option>
                </select>
                <select id='fort' name='fort'>
                    <option>Weak</option>
                    <option>Good</option>
                </select>
                <select id='ref' name='ref'>
                    <option>Weak</option>
                    <option>Good</option>
                </select>
                <select id='will' name='will'>
                    <option>Weak</option>
                    <option>Good</option>
                </select>
            </form>
        `;
    }

    attachNodes() {
        this._nodes = {
            'class-form': this.#shadow.getElementById('class-form'),
            inputs: {
                name: this.#shadow.getElementById('name'),
                hitdie: this.#shadow.getElementById('hitdie'),
                bab: this.#shadow.getElementById('bab'),
                fort: this.#shadow.getElementById('fort'),
                ref: this.#shadow.getElementById('ref'),
                will: this.#shadow.getElementById('will')
            }
        }
    }

}

customElements.define('class-form', ClassForm);