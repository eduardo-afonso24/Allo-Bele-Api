import { Response, Request } from "express";
import { Category } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const registerCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {

    if (!name) {
      return res.status(400).json({ message: "O nome e obrigatório." });
    }

    const category = new Category({
      name
    })

    await category.save();
    const updatedCategory = await Category.find({})
      .sort({ timestamp: -1 })
      .lean();
    getIO().emit("category", updatedCategory);
    res.status(200).json({ message: "Categoria registrado com sucesso", category });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar a categoria", error });
  }
};