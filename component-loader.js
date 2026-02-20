const components = [
    'ability-scores',
    'app-router',
    'character-ac',
    'character-cm',
    'character-list',
    'character-saves',
    'character-sheet',
    'mod-form',
    'skills',
]

async function loadComponents() {
    for (const component of components) {
        console.log(`Loading: ${component}`)
        try {
            await import(`./components/${component}.js`);
        } catch (err) {
            console.error(`Failed to load component: ${component}`, err);
        }
    }
}

loadComponents();

export { loadComponents };