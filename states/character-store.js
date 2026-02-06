export class CharacterStore extends EventTarget {
    #state = { name: 'moe' };

    getState() { return structuredClone(this.#state); }

    set(partial) {
        this.#state = { ...this.#state, ...partial };
        this.dispatchEvent(new CustomEvent('change', { detail: this.getState() }));
    }
}
export const characterStore = new CharacterStore();
