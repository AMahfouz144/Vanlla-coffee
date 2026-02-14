const routes = {
    '/': 'home',
    '/details': 'details',
    '/cart': 'cart',
    '/login': 'login',
    '/register': 'register',
    '/order': 'order'
};

const router = {
    init: () => {
        window.addEventListener('hashchange', router.handleRoute);
        window.addEventListener('load', router.handleRoute);
    },

    handleRoute: async () => {
        const hash = window.location.hash.slice(1) || '/';
        const [path, queryString] = hash.split('?');
        
        const viewName = routes[path];
        
        if (viewName) {
            try {
                const module = await import(`../views/${viewName}.js`);
                const view = module.default;
                const app = document.getElementById('app');
                
                // Parse query params
                const params = new URLSearchParams(queryString);
                const props = Object.fromEntries(params.entries());

                app.innerHTML = await view.render(props);
                if (view.afterRender) await view.afterRender(props);
                
                // Update active state in navbar if exists
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${path}`) {
                        link.classList.add('active');
                    }
                });

            } catch (error) {
                console.error('Error loading view:', error);
                document.getElementById('app').innerHTML = '<h1>404 - Page Not Found</h1>';
            }
        } else {
            document.getElementById('app').innerHTML = '<h1>404 - Page Not Found</h1>';
        }
    },

    navigateTo: (path) => {
        window.location.hash = path;
    }
};

export default router;
