import { Response, Request } from "express";
import { CategoryProduct } from "../../../../shared";

export const registerCategoryProduct = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {

    if (!name) {
      return res.status(400).json({ message: "o nome é obrigatório." });
    }

    const category = new CategoryProduct({
      name
    })

    await category.save();

    res.status(200).json({ message: "Categoria de produto adicionado com sucesso", category });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar a categoria de produto", error });
  }
};