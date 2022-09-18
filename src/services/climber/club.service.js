const { Club } = require('../../models');

/**
 * Create a club
 * @param {Object} clubBody
 * @returns {Promise<Club>}
 */
const createClub = async (clubBody) => {
  const club = await Club.create(clubBody);
  return club;
};

/**
 * Query for clubs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClubs = async (filter, options) => {
  const clubs = await Club.paginate(filter, options);
  return clubs;
};

/**
 * Get club by id
 * @param {ObjectId} id
 * @returns {Promise<Club>}
 */
const getClubById = async (id) => {
  return Club.findById(id);
};

/**
 * Update club by id
 * @param {ObjectId} clubId
 * @param {Object} updateBody
 * @returns {Promise<Club>}
 */
const updateClub = async (club, updateBody) => {
  Object.assign(club, updateBody);
  await club.save();

  return club;
};

/**
 * Delete club by id
 * @param {ObjectId} clubId
 * @returns {Promise<Club>}
 */
const deleteClub = async (club) => {
  await club.remove();
  return club;
};

module.exports = {
  createClub,
  queryClubs,
  getClubById,
  updateClub,
  deleteClub,
};
