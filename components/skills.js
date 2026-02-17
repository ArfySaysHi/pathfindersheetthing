import { characterStore } from "../states/character-store.js";

class Skills extends HTMLElement {
    #shadow = null;
    _nodes = null;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.skills = [];
    }

    connectedCallback() {
        this.initialRender();
        this.assignNodes();
        this.renderSkills();
    }

    renderSkills() {
        const { derived: { skills } } = characterStore.getState();
        this._nodes['skill-rows'].innerHTML = Object.keys(skills).map(k => {
            return `<tr>
                <td>${k}</td>
                <td><input type='checkbox' value='${skills[k].classSkill}' disabled='true' /></td>
                <td>${skills[k].abilityScore}</td>
                <td>${skills[k].skillMod}</td>
                <td>${skills[k].rank}</td>
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