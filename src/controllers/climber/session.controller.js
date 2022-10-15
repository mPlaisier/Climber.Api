const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { sessionService, subscriptionService, clubService } = require('../../services');

const createSession = catchAsync(async (req, res) => {
  const { subscription, isSingleEntree, club } = req.body;

  if (subscription == null && isSingleEntree == null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You should provide a subscription or set isSingleEntree to true');
  }
  if (subscription == null && isSingleEntree != null && isSingleEntree === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'isSingleEntree should be true when no subscription is given');
  }
  if (subscription != null && isSingleEntree != null && isSingleEntree === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You should not provide a subscription and set isSingleEntree to true');
  }

  // Check if the subscription club matches the club for the session
  if (subscription != null) {
    const sessionSubscription = await subscriptionService.getSubscriptionById(subscription);

    if (sessionSubscription == null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The subscription does not exists');
    }
    // eslint-disable-next-line eqeqeq
    if (sessionSubscription.club.toHexString() !== club) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The subscription is not for the given club');
    }
  }

  // Check if the club still exists,
  const sessionClub = await clubService.getClubById(club);
  if (sessionClub == null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The club does not exists');
  }

  const session = await sessionService.createSession({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(session);
});

const getSessions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['club', 'climbingType']);
  let options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Populate
  const populate = { populate: 'club, subscription' };
  options = { ...options, ...populate };

  const result = await sessionService.querySessions({ ...filter, user: req.user }, options);
  res.send(result);
});

const getSession = catchAsync(async (req, res, next) => {
  const session = await sessionService.getSessionById(req.params.sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  if (!session.user || session.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.session = session;
  next();
});

const updateSession = catchAsync(async (req, res) => {
  const { subscription, isSingleEntree, club } = req.body;

  const session = await sessionService.getSessionById(req.params.sessionId);

  if (subscription != null && isSingleEntree != null && isSingleEntree === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'isSingleEntree should not be set to true when a subscription is set');
  }
  if (subscription == null && isSingleEntree != null && isSingleEntree === false && session.subscription === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'isSingleEntree should be true when no subscription is given');
  }
  if (subscription != null && isSingleEntree == null && session.isSingleEntree === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You should not provide a subscription when isSingleEntree is set to true');
  }

  // Check if the subscription club matches the club for the session
  if (subscription != null) {
    const sessionSubscription = await subscriptionService.getSubscriptionById(subscription);

    if (sessionSubscription == null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The subscription does not exists');
    }
    // eslint-disable-next-line eqeqeq
    if (sessionSubscription.club.toHexString() !== club) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The subscription is not for the given club');
    }
  }

  // Check if the club still exists,
  if (club != null) {
    const sessionClub = await clubService.getClubById(club);
    if (sessionClub == null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The club does not exists');
    }
  }

  const updated = await sessionService.updateSession(res.session, req.body);
  res.send(updated);
});

const deleteSession = catchAsync(async (_req, res) => {
  await sessionService.deleteSession(res.session);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSession,
  getSession,
  getSessions,
  updateSession,
  deleteSession,
};
