class AppRouter extends HTMLElement {
    constructor() {
        super();
        this.routes = [
            { pattern: /^\/pathfindersheetthing\/$/, tag: 'character-list' },
            { pattern: /^\/pathfindersheetthing\/character\/([^\/]+)\/?$/, tag: 'character-sheet', params: ['id'] }
        ];
    }

    connectedCallback() {
        window.addEventListener('popstate', () => this.handleRoute());
        this.handleRoute();
    }

    navigate(path) {
        history.pushState({}, '', path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        this.innerHTML = '';

        for (const r of this.routes) {
            const m = path.match(r.pattern);
            if (m) {
                const el = document.createElement(r.tag);
                if (r.params) {
                    const params = {};
                    r.params.forEach((name, i) => params[name] = decodeURIComponent(m[i + 1]));
                    el.routeParams = params;
                    el.setAttribute('data-route', JSON.stringify(params));
                }
                this.appendChild(el);
                return;
            }
        }

        this.appendChild(document.createElement('character-list'));
    }
}

customElements.define('app-router', AppRouter);
