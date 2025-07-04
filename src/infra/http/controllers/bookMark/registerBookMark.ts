import { Response, Request } from "express";
import { User, BookMark, Category, BarbersShops } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const registerBookMark = async (req: Request, res: Response) => {
  const { appointmentDate, category, barberId } = req.body;

  const { clientId } = req.params;

  try {

    const findCategory = await Category.findById(category);
    if (!findCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    const user = await User.findById(clientId);
    if (user) {
      if (!appointmentDate) {
        return res.status(400).json({ message: "A data e obrigatório." });
      }

      const book = new BookMark({
        clientId,
        barberId,
        category,
        appointmentDate
      })

      await book.save();
      const updatedBook = await BookMark.find()
        .populate('clientId', 'name address')
        .populate('barberId', 'name address')
        .populate('category', 'name')
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("getAllBook", updatedBook);
      res.status(200).json({ message: "Agendamento adicionado com sucesso", book });
    }

    const barberShops = await BarbersShops.findById(clientId);
    if (barberShops) {
      if (!appointmentDate) {
        return res.status(400).json({ message: "A data é obrigatório." });
      }

      const book = new BookMark({
        clientId,
        barberId,
        category,
        appointmentDate
      })

      await book.save();
      const updatedBook = await BookMark.find()
        .populate('clientId', 'name address')
        .populate('barberId', 'name address')
        .populate('category', 'name')
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("getAllBook", updatedBook);
      res.status(200).json({ message: "Agendamento adicionado com sucesso", book });
    }


  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar agendamento", error });
  }
};