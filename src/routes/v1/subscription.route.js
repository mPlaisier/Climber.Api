const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { subscriptionValidation } = require('../../validations');
const { subscriptionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(subscriptionValidation.getSubscriptions), subscriptionController.getSubscriptions)
  .post(auth(), validate(subscriptionValidation.createSubscription), subscriptionController.createSubscription);

router
  .route('/:subscriptionId')
  .patch(
    auth(),
    validate(subscriptionValidation.updateSubscription),
    subscriptionController.getSubscription,
    subscriptionController.updateSubscription
  )
  .delete(
    auth(),
    validate(subscriptionValidation.deleteSubscription),
    subscriptionController.getSubscription,
    subscriptionController.deleteSubscription
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Subscription management and retrieval
 */
