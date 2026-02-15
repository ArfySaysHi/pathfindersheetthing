// Base state should be the base for a new character (AC 10 etc)
export class CharacterStore extends EventTarget {
    #state = null;

    getState() { return structuredClone(this.#state); }

    set(partial) {
        this.#state = { ...this.#state, ...partial };
        this.dispatchEvent(new CustomEvent('change', { detail: this.getState() }));
    }
}
export const characterStore = new CharacterStore();
