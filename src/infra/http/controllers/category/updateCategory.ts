import { Response, Request } from "express";
import { Category } from "../../../../shared";
import { getIO } from "../socket/sockets";


export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const findCategory = await Category.findById(id);
    if (!findCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    const category = await Category.findByIdAndUpdate(id, {
      name
    },
      { new: true });

    const updatedCategory = await Category.find({})
      .sort({ timestamp: -1 })
      .lean();
    getIO().emit("category", updatedCategory);

    res.status(200).json({ message: "Categoria editada com sucesso", category });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar a categoria", error });
  }
};