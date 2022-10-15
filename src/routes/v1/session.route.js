const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { sessionValidation } = require('../../validations');
const { sessionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(sessionValidation.getSessions), sessionController.getSessions)
  .post(auth(), validate(sessionValidation.createSession), sessionController.createSession);

router
  .route('/:sessionId')
  .patch(auth(), validate(sessionValidation.updateSession), sessionController.getSession, sessionController.updateSession)
  .delete(auth(), validate(sessionValidation.deleteSession), sessionController.getSession, sessionController.deleteSession);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Session
 *   description: Session management and retrieval
 */
