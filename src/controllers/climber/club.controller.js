const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { clubService } = require('../../services');

const createClub = catchAsync(async (req, res) => {
  const club = await clubService.createClub({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(club);
});

const getClubs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'isMember', 'city']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await clubService.queryClubs({ ...filter, user: req.user }, options);
  res.send(result);
});

const getClub = catchAsync(async (req, res, next) => {
  const club = await clubService.getClubById(req.params.clubId);
  if (!club) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
  }
  if (!club.user || club.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.club = club;
  next();
});

const updateClub = catchAsync(async (req, res) => {
  const club = await clubService.updateClub(res.club, req.body);
  res.send(club);
});

const deleteClub = catchAsync(async (_req, res) => {
  await clubService.deleteClub(res.club);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createClub,
  getClub,
  getClubs,
  updateClub,
  deleteClub,
};
