const routes = {
  login: '/admin/auth/login',
  logout: '/admin/auth/logout',
  dashboard: '/admin',
  userManage: '/admin/user',
  usercreate: '/admin/user/create',
  roleManage: '/admin/role',
  roleCreate: '/admin/role/create',
  userDetail: id => `/admin/user/${id}`,
  userEdit: id => `/admin/user/edit/${id}`,
  userDelete: id => `/admin/user/delete/${id}`,
};

function getRoute(name, param) {
  const route = routes[name];
  if (typeof route === 'function') return route(param);
  return route || '/';
}

module.exports = { getRoute, routes };
