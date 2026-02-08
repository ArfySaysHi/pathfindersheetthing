// Base state should be the base for a new character (AC 10 etc)
export class CharacterStore extends EventTarget {
    #state = {
        info: {
            name: 'Name',
            alignment: 'True Neutral',
            race: 'Human',
            deity: 'None',
            age: 30,
            gender: 'Any',
            height: '5ft',
            weight: '65kg',
            eyes: 'brown',
            hair: 'brown',
            description: '',
            languages: []
        },
        combat: {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
        },
        inventory: [],
        feats: [],
        skills: [],
        spells: [],
        currentXp: 0,
        classes: [],
    };

    getState() { return structuredClone(this.#state); }

    set(partial) {
        this.#state = { ...this.#state, ...partial };
        this.dispatchEvent(new CustomEvent('change', { detail: this.getState() }));
    }
}
export const characterStore = new CharacterStore();
