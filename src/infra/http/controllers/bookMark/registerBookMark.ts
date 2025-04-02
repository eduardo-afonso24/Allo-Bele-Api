import { Response, Request } from "express";
import { User, BookMark } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const registerBookMark = async (req: Request, res: Response) => {
  const { barberId, appointmentDate } = req.body;

  const { clientId } = req.params;

  try {
    const user = await User.findById(clientId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!appointmentDate) {
      return res.status(400).json({ message: "A data e obrigatório." });
    }

    const book = new BookMark({
      clientId,
      barberId,
      appointmentDate
    })

    await book.save();
    getIO().emit("newBook", book);
    res.status(200).json({ message: "Serviço adicionado com sucesso", book });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar serviço", error });
  }
};