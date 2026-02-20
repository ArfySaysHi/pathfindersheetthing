import { characterStore } from "../states/character-store.js";

class Skills extends HTMLElement {
    #shadow = null;
    _nodes = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.skills = [];

        this._onChange = this._onChange.bind(this);
    }

    connectedCallback() {
        this.initialRender();
        this.assignNodes();
        this.renderSkills();

        this.#shadow.addEventListener('change', this._onChange);
    }

    disconnectedCallback() {
        this.#shadow.removeEventListener('change', this._onChange);
    }

    _onChange(e) {
        console.log(e.target, e.target.dataset.skill);
        if (!e.target.dataset?.skill) return;

        const character = characterStore.getState();
        let newState = structuredClone(character)
        newState.derived.skills[e.target.dataset.skill].rank = e.target.value;
        characterStore.set(newState);
        characterStore.save();
    }

    renderSkills() {
        const { derived: { skills } } = characterStore.getState();
        this._nodes['skill-rows'].innerHTML = Object.keys(skills).sort().map(k => {
            return `<tr>
                <td>${k}</td>
                <td><input type='checkbox' ${skills[k].classSkill ? 'checked=""' : ''} disabled='true' /></td>
                <td>${skills[k].abilityScore}</td>
                <td>${skills[k].skillMod}</td>
                <td><input type='number' data-skill='${k}' min='0' value='${skills[k].rank}' /></td>
            </tr>`;
        }).join('')
    }

    initialRender() {
        this.#shadow.innerHTML = `
            <div id='skills'>
                <div id='willContainNewSkillsForm'></div>
                <table id='skills-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>CS</th>
                            <th>Skill Mod</th>
                            <th>Bonus</th>
                            <th>Ranks</th>
                        </tr>
                    </thead>
                    <tbody id='skill-rows'>
                    </tbody>
                </table>
            </div>
        `;
    }

    assignNodes() {
        this._nodes = {
            'skill-rows': this.#shadow.getElementById('skill-rows')
        }
    }
}

customElements.define('skill-table', Skills);