const { Session } = require('../../models');

/**
 * Create a session
 * @param {Object} sessionBody
 * @returns {Promise<Session>}
 */
const createSession = async (sessionBody) => {
  const session = await Session.create(sessionBody);
  return session;
};

/**
 * Query for sessions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySessions = async (filter, options) => {
  const sessions = await Session.paginate(filter, options);
  return sessions;
};

/**
 * Get session by id
 * @param {ObjectId} id
 * @returns {Promise<Session>}
 */
const getSessionById = async (id) => {
  return Session.findById(id);
};

/**
 * Update session by id
 * @param {ObjectId} sessionId
 * @param {Object} updateBody
 * @returns {Promise<Session>}
 */
const updateSession = async (session, updateBody) => {
  Object.assign(session, updateBody);
  await session.save();

  return session;
};

/**
 * Delete session by id
 * @param {ObjectId} sessionId
 * @returns {Promise<Session>}
 */
const deleteSession = async (session) => {
  await session.remove();
  return session;
};

module.exports = {
  createSession,
  querySessions,
  getSessionById,
  updateSession,
  deleteSession,
};
