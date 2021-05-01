import auth from './auth';
import config from './config';
import order from './order';
import warehouse from './warehouse';
import receipt from './receipt';
import statistics from './statistics';
export const asyncRoutes = [
  auth,
  config,
  order,
  warehouse,
  receipt,
  statistics
];
