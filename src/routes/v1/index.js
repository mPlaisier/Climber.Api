const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');

const clubRoute = require('./club.route');
const subscriptionRoute = require('./subscription.route');
const sessionRoute = require('./session.route');

const docsRoute = require('./docs.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/club',
    route: clubRoute,
  },
  {
    path: '/subscription',
    route: subscriptionRoute,
  },
  {
    path: '/session',
    route: sessionRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
