const DEFAULT_STATE = [
    { name: 'Belt of Incredible Dexterity +2', mods: [] }
]

export class ItemStore extends EventTarget {
    #state = structuredClone(DEFAULT_STATE);

    getState() { return structuredClone(this.#state) }

    set(partial = {}) {
        this.#state = { ...this.#state, ...partial };
        this.dispatchEvent(new CustomEvent('change', { detail: this.getState() }));
    }
}

export const itemStore = new ItemStore();