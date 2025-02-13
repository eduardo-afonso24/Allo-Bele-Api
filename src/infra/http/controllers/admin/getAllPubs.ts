import { Response, Request } from "express";
import { Pubs } from "../../../../shared";


export const getAllPubs = async (_: Request, res: Response) => {
  try {
    const pubs = await Pubs.find().sort({ createdAt: -1 });
    res.status(201).json({ message: 'Publicação criada com sucesso', pubs });
  } catch (error) {
    console.error('Erro ao criar publicação', error);
    res.status(500).json({ message: 'Erro ao criar publicação.' });
  }
};