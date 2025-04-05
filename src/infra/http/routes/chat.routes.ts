import { Router } from 'express';
import { createRoom, getRooms, joinChat, } from '../controllers/room/room.controller';
import { getAllMessage } from '../controllers/message/getAllMessage';
import { getAllNewMessage } from '../controllers/message/getAllNewMessage';
import { sendMessage } from '../controllers/message/sendMessage';

const router = Router();

router.post('/join', joinChat);

router.post('/message', sendMessage);
router.get('/messages/:roomId', getAllMessage);
router.get('/new-messages/:roomId', getAllNewMessage);

router.post('/rooms', createRoom);
router.get('/rooms', getRooms);

export default router;