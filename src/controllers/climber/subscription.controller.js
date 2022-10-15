const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { subscriptionService } = require('../../services');

const createSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.createSubscription({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(subscription);
});

const getSubscriptions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['club', 'subscriptionType', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subscriptionService.querySubscriptions({ ...filter, user: req.user }, options);
  res.send(result);
});

const getSubscription = catchAsync(async (req, res, next) => {
  const subscription = await subscriptionService.getSubscriptionById(req.params.subscriptionId);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }
  if (!subscription.user || subscription.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.subscription = subscription;
  next();
});

const updateSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.updateSubscription(res.subscription, req.body);
  res.send(subscription);
});

const deleteSubscription = catchAsync(async (_req, res) => {
  await subscriptionService.deleteSubscription(res.subscription);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubscription,
  getSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
};
