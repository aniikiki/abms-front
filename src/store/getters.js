const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    name: state => state.user.username,
    avatar: state => state.user.avatar,
    addRoutes: state => state.route.addRoutes,
    allRoutes: state => state.route.routes,
};

export default getters
