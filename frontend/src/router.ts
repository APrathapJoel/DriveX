type RouteHandler = (params?: Record<string, string>) => void;

interface Route {
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

class Router {
  private routes: Route[] = [];
  private notFoundHandler: RouteHandler = () => {};

  add(path: string, handler: RouteHandler): this {
    const paramNames: string[] = [];
    const pattern = path.replace(/:(\w+)/g, (_match, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    this.routes.push({
      pattern: new RegExp(`^${pattern}$`),
      paramNames,
      handler,
    });
    return this;
  }

  notFound(handler: RouteHandler): this {
    this.notFoundHandler = handler;
    return this;
  }

  navigate(path: string, pushState = true) {
    if (pushState) {
      window.history.pushState({}, '', path);
    }
    this.resolve(path);
  }

  private resolve(path: string) {
    // Remove query string for matching
    const cleanPath = path.split('?')[0];

    for (const route of this.routes) {
      const match = cleanPath.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        route.handler(params);
        return;
      }
    }
    this.notFoundHandler();
  }

  start() {
    // Handle popstate (back/forward)
    window.addEventListener('popstate', () => {
      this.resolve(window.location.pathname);
    });

    // Intercept link clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[data-link]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          this.navigate(href);
        }
      }
    });

    // Initial route
    this.resolve(window.location.pathname);
  }

  getCurrentPath(): string {
    return window.location.pathname;
  }
}

export const router = new Router();
