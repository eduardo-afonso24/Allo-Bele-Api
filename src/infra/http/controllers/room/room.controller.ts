import { Request, Response } from 'express';
import { getMessagesByRoomIdService, sendMessageService } from '../message';
import { addUserToRoomService, createRoomService, getAllRoomsService } from './room.service';
import { User } from '../../../../shared';

export const joinChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, roomId } = req.body;
    if (!userId || !roomId) {
      res
        .status(400)
        .json({ message: 'Name, socketId, and roomId are required' });
      return;
    }

    const user = await User.findById(userId);
    const room = await addUserToRoomService(roomId, user._id as unknown as string);
    res.status(201).json({ message: 'User joined', room });
  } catch (error) {
    console.error('Error in joinChat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { senderId, roomId, username, text } = req.body;
    if (!senderId || !roomId || !username || !text) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const message = await sendMessageService(
      username,
      text,
      roomId,
      senderId,
    );
    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoomMessages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { roomId } = req.params;
    const messages = await getMessagesByRoomIdService(roomId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getRoomMessages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await getAllRoomsService();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error in getRooms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRoom = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { roomName } = req.body;
    if (!roomName) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const message = await createRoomService(roomName);
    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error('Error in createRoom:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};