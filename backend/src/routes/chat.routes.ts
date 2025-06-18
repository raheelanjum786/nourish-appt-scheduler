import express from 'express';
import * as chatController from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/messages', chatController.sendMessage);
router.get('/messages/:appointmentId', chatController.getMessages);
router.post('/call', chatController.initiateCall);
router.put('/call/:messageId', chatController.updateCallStatus);
router.get('/unread', chatController.getUnreadMessageCount);

export default router;