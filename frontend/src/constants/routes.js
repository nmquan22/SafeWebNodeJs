const routes = {
  LOGIN: "/login",
  APP: "/app/*",
  ERROR: "/error",
  LOGOUT: "/logout",
};

const appRoutes = {
  DASHBOARD: "dashboard",
};

const apiRoutes = {
  LOGIN_API: "/api/login",
  LOGOUT_API: "/api/logout",
  AUTHORIZE_API: "/api/hello",
  SERVERHEALTH_API: "/api/health",
}

export { routes, appRoutes, apiRoutes };
