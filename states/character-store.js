const DEFAULT_STATE = {
    id: '0',
    version: 1,
    level: 1,
    info: {
        name: 'Name',
        alignment: 'True Neutral',
        art: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Favatar-photo-placeholder-icon-design-vector-id1221380217%3Fk%3D20%26m%3D1221380217%26s%3D612x612%26w%3D0%26h%3DavdFJ5PNo-CSkbUZzQ0Xm8h3u5BovGfSNDrfRicPDfY%3D&f=1&nofb=1&ipt=aa71c93bbec72fce059e3fd7b33bfbf3705f7c3553e87f8e9af3c469fb114d75',
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
    classes: [],
    items: [],
    feats: [],
    derived: {
        abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
        AC: 10,
        hp: 0,
        saves: { fort: 0, ref: 0, will: 0 },
        skills: {
            Acrobatics: { type: 'adventure', classSkill: false, abilityScore: 'dex', skillMod: 0, rank: 0 },
            Appraise: { type: 'background', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            Bluff: { type: 'adventure', classSkill: false, abilityScore: 'cha', skillMod: 0, rank: 0 },
            Climb: { type: 'adventure', classSkill: false, abilityScore: 'str', skillMod: 0, rank: 0 },
            Diplomacy: { type: 'adventure', classSkill: false, abilityScore: 'cha', skillMod: 0, rank: 0 },
            'Disable Device': { type: 'adventure', classSkill: false, abilityScore: 'dex', skillMod: 0, rank: 0 },
            Disguise: { type: 'adventure', classSkill: false, abilityScore: 'cha', skillMod: 0, rank: 0 },
            'Escape Artist': { type: 'adventure', classSkill: false, abilityScore: 'dex', skillMod: 0, rank: 0 },
            Fly: { type: 'adventure', classSkill: false, abilityScore: 'dex', skillMod: 0, rank: 0 },
            'Handle Animal': { type: 'background', classSkill: false, abilityScore: 'cha', skillMod: 0, rank: 0 },
            Heal: { type: 'adventure', classSkill: false, abilityScore: 'wis', skillMod: 0, rank: 0 },
            Intimidate: { type: 'adventure', classSkill: false, abilityScore: 'cha', skillMod: 0, rank: 0 },
            'Knowledge (Arcana)': { type: 'adventure', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (Dungeoneering)': { type: 'adventure', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (Engineering)': { type: 'background', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (Geography)': { type: 'background', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (History)': { type: 'background', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (Local)': { type: 'adventure', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (Nature)': { type: 'adventure', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (Nobility)': { type: 'background', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (Planes)': { type: 'adventure', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            'Knowledge (Religion)': { type: 'adventure', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            Linguistics: { type: 'background', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            Perception: { type: 'adventure', classSkill: false, abilityScore: 'wis', skillMod: 0, rank: 0 },
            Profession: { type: 'background', classSkill: false, abilityScore: 'wis', skillMod: 0, rank: 0 },
            Ride: { type: 'adventure', classSkill: false, abilityScore: 'dex', skillMod: 0, rank: 0 },
            'Sense Motive': { type: 'adventure', classSkill: false, abilityScore: 'wis', skillMod: 0, rank: 0 },
            'Sleight of Hand': { type: 'background', classSkill: false, abilityScore: 'dex', skillMod: 0, rank: 0 },
            Spellcraft: { type: 'adventure', classSkill: false, abilityScore: 'int', skillMod: 0, rank: 0 },
            Stealth: { type: 'adventure', classSkill: false, abilityScore: 'dex', skillMod: 0, rank: 0 },
            Survival: { type: 'adventure', classSkill: false, abilityScore: 'wis', skillMod: 0, rank: 0 },
            Swim: { type: 'adventure', classSkill: false, abilityScore: 'str', skillMod: 0, rank: 0 },
            'Use Magic Device': { type: 'adventure', classSkill: false, abilityScore: 'cha', skillMod: 0, rank: 0 }
        },
        options: {}
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

    addClass(cls) {
        if (!cls) return;
        if (this.#state.classes.find(c => c.name.toLowerCase() === cls.name.toLowerCase())) return console.warn("You already have this class");
        this.set({ classes: [...this.#state.classes, cls] });
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

    computeAbilityMods(scores) {
        const keys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        const out = {};
        keys.forEach(k => {
            const v = Number(scores?.[k] ?? 10);
            out[k] = Math.floor((v - 10) / 2);
        });
        return out;
    }

    computeSkills(state = {}) {
        return state.derived.skills;
    }

    // TODO: Make less placeholdery
    computeDerived(state) {
        const abilityScores = this.computeAbilityScores(state.pointBuy);
        const abilityMods = this.computeAbilityMods(abilityScores);
        const AC = 10 + (abilityMods.dex ?? 0);
        const hp = (state.level ?? 1) * (10 + (abilityMods.con ?? 0));
        const saves = {
            fort: abilityMods.con ?? 0,
            ref: abilityMods.dex ?? 0,
            will: abilityMods.wis ?? 0
        };
        const skills = this.computeSkills(state);
        return { abilityScores, abilityMods, AC, hp, saves, skills };
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
