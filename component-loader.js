const components = [
    'app-router',
    'character-list',
    'character-sheet'
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