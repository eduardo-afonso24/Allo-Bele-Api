// chat.routes.ts
import { Router } from 'express';
import { getAllMessage } from '../controllers/message/getAllMessage';
import { getAllNewMessage } from '../controllers/message/getAllNewMessage';
// import { sendMessage } from '../controllers/message/sendMessage';
import { getAllRoom, getRoomByParticipants } from '../controllers/room';

const router = Router();
router.get('/messages/:roomId', getAllMessage);
router.get('/new-messages/:roomId', getAllNewMessage);

router.get('/rooms', getAllRoom);
router.get('/get-room-by-participants/:userId', getRoomByParticipants);

export default router;
