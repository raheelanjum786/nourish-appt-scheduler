import express from 'express';
import * as chatController from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { 
  sendMessageSchema,
  callSchema,
  offerSchema,
  answerSchema,
  iceCandidateSchema
} from '../validations/chat.validation';

const router = express.Router();

router.use(protect);

router.get('/:appointmentId', chatController.getChatMessages);
router.post('/:appointmentId/send', validateRequest(sendMessageSchema), chatController.sendMessage);
router.post('/:appointmentId/call', validateRequest(callSchema), chatController.initiateCall);
router.post('/:appointmentId/offer', validateRequest(offerSchema), chatController.sendOffer);
router.post('/:appointmentId/answer', validateRequest(answerSchema), chatController.sendAnswer);
router.post('/:appointmentId/ice-candidate', validateRequest(iceCandidateSchema), chatController.sendIceCandidate);
router.post('/:appointmentId/end-call', chatController.endCall);

router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Chat route error:', err);
  res.status(500).json({ 
    error: 'ChatServiceError',
    message: 'An error occurred in the chat service',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default router;