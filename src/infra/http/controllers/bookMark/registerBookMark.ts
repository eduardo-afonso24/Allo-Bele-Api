import { Response, Request } from "express";
import { User, BookMark, Category } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const registerBookMark = async (req: Request, res: Response) => {
  const { appointmentDate, category } = req.body;

  const { clientId } = req.params;

  try {
    const user = await User.findById(clientId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const findCategory = await Category.findById(category);
    if (!findCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    if (!appointmentDate) {
      return res.status(400).json({ message: "A data e obrigatório." });
    }

    const book = new BookMark({
      clientId,
      category,
      appointmentDate
    })

    await book.save();
    getIO().emit("newBook", book);
    res.status(200).json({ message: "Agendamento adicionado com sucesso", book });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar agendamento", error });
  }
};