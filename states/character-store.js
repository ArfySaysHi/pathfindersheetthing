const DEFAULT_STATE = {
    id: '0',
    version: 1,
    level: 1,
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
    pointBuy: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
    },
    feats: [],
    modifiers: [],
    derived: {
        abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
        AC: 10,
        hp: 0,
        saves: { fort: 0, ref: 0, will: 0 }
    }
};

export class CharacterStore extends EventTarget {
    #state = structuredClone(DEFAULT_STATE);

    getState() { return structuredClone(this.#state); }

    set(partial = {}) {
        this.#state = { ...this.#state, ...partial, version: (this.#state.version || 0) + 1 };
        this.#state.derived = this.computeDerived(this.#state);
        this.dispatchEvent(new CustomEvent('change', { detail: this.getState() }));
    }

    patchPointBuy(patch = {}) {
        const pb = { ...this.#state.pointBuy, ...patch };
        this.set({ pointBuy: pb });
    }

    computeAbilityScores(pointBuy) {
        const keys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        const out = {};
        keys.forEach(k => {
            // TODO: Expand to account for modifiers later
            const v = Number(pointBuy?.[k] ?? 10);
            out[k] = v;
        })
        return out;
    }

    computeAbilityMods(pointBuy) {
        const keys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        const out = {};
        keys.forEach(k => {
            const v = Number(pointBuy?.[k] ?? 10);
            out[k] = Math.floor((v - 10) / 2);
        });
        return out;
    }

    // TODO: Make less placeholdery
    computeDerived(state) {
        const abilityScores = this.computeAbilityScores(state.pointBuy);
        const abilityMods = this.computeAbilityMods(state.pointBuy);
        const AC = 10 + (abilityMods.dex ?? 0);
        const hp = (state.level ?? 1) * (10 + (abilityMods.con ?? 0));
        const saves = {
            fort: abilityMods.con ?? 0,
            ref: abilityMods.dex ?? 0,
            will: abilityMods.wis ?? 0
        };
        return { abilityScores, abilityMods, AC, hp, saves };
    }

    save() {
        let characters = JSON.parse(localStorage.getItem('characters'));
        if (!characters) {
            localStorage.setItem('characters', JSON.stringify([this.#state]));
            console.log("Created characters in localstorage and saved");
        } else {
            const thisChar = characters.findIndex(c => c.id === this.#state.id);
            if (thisChar === -1) {
                localStorage.setItem('characters', JSON.stringify([...characters, this.#state]));
                console.log('Added character to list');
            } else {
                characters[thisChar] = this.#state;
                localStorage.setItem('characters', JSON.stringify(characters));
                console.log('Updated character');
            }
        }
    }
}
export const characterStore = new CharacterStore();
