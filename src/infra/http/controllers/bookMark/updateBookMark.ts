import { Response, Request } from "express";
import { BookMark } from "../../../../shared";


export const updateBookMark = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { confirmed } = req.body;

  try {
    const findBook = await BookMark.findById(id);
    if (!findBook) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    const book = await BookMark.findByIdAndUpdate(id, {
      confirmed
    },
      { new: true });

    res.status(200).json({ message: "Agendamento editado com sucesso", book });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar agendamento", error });
  }
};