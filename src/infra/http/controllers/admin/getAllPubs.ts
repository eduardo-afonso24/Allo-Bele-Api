import { Response, Request } from "express";
import { Pubs } from "../../../../shared";


export const getAllPubs = async (_: Request, res: Response) => {
  try {
    const pubs = await Pubs.find()
      .sort({ timestamp: -1 })
      .lean();
    res.status(201).json({ pubs });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar publicação.' });
  }
};