// TODO: Add class skills
// TODO: Add skill ranks
// TODO: Add class features at certain levels
const DEFAULT_STATE = [
    {
        name: 'Fighter',
        level: 1,
        hitdie: '1d10',
        bab: 1,
        fort: 'Good',
        ref: 'Good',
        will: 'Weak'
    }
]

export class ClassStore extends EventTarget {
    #state = structuredClone(DEFAULT_STATE);

    getState() { return structuredClone(this.#state); }

    add(newClass) {
        // TODO: Validation if I don't make a backend
        this.#state.push(newClass);
        this.dispatchEvent(new CustomEvent('change', { detail: this.getState() }));
    }

    remove(name) {
        this.#state = this.#state.filter(c => c.name === name);
        this.dispatchEvent(new CustomEvent('change', { detail: this.getState() }));
    }
}

export const classStore = new ClassStore();