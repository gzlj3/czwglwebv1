export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/fyglmain' },
      {
        path: '/fyglmain',
        name: 'fyglmain',
        component: './Fygl/FyglMain',
      },
    ],
  },
];
