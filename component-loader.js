const components = [
    'ability-scores',
    'app-router',
    'character-ac',
    'character-classes',
    'character-cm',
    'character-list',
    'character-saves',
    'character-sheet',
    'menu/class-form',
    'menu/class-list',
    'mod-form',
    'skills',
    'tab-container',
    'tab-panel'
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