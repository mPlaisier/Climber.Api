const { Subscription } = require('../../models');

/**
 * Create a subscription
 * @param {Object} subscriptionBody
 * @returns {Promise<Subscription>}
 */
const createSubscription = async (subscriptionBody) => {
  const subscription = await Subscription.create(subscriptionBody);
  return subscription;
};

/**
 * Query for subscriptions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubscriptions = async (filter, options) => {
  const subscriptions = await Subscription.paginate(filter, options);
  return subscriptions;
};

/**
 * Get subscription by id
 * @param {ObjectId} id
 * @returns {Promise<Subscription>}
 */
const getSubscriptionById = async (id) => {
  return Subscription.findById(id);
};

/**
 * Update subscription by id
 * @param {ObjectId} subscriptionId
 * @param {Object} updateBody
 * @returns {Promise<Subscription>}
 */
const updateSubscription = async (subscription, updateBody) => {
  Object.assign(subscription, updateBody);
  await subscription.save();

  return subscription;
};

/**
 * Delete subscription by id
 * @param {ObjectId} subscriptionId
 * @returns {Promise<Subscription>}
 */
const deleteSubscription = async (subscription) => {
  await subscription.remove();
  return subscription;
};

module.exports = {
  createSubscription,
  querySubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};
