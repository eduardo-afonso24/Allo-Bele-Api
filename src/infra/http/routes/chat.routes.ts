import { Router } from 'express';
import { createRoom, getRoomMessages, getRooms, joinChat, sendMessage } from '../controllers/room/room.controller';

const router = Router();

router.post('/join', joinChat);

router.post('/message', sendMessage);
router.get('/messages/:roomId', getRoomMessages);

router.post('/rooms', createRoom);
router.get('/rooms', getRooms);

export default router;