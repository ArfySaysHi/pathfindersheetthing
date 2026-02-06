class AppRouter extends HTMLElement {
    constructor() {
        super();
        this.routes = {
            '/pathfindersheetthing/': 'character-list',
            '/pathfindersheetthing/character': 'character-sheet'
        }
    }

    connectedCallback() {
        window.addEventListener('popstate', this.handleRoute.bind(this));
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const componentTag = this.routes[path] || 'character-list';

        this.innerHTML = '';
        const component = document.createElement(componentTag);
        this.appendChild(component);
    }
}

customElements.define('app-router', AppRouter)