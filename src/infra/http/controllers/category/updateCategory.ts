import { Response, Request } from "express";
import { Category } from "../../../../shared";


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

    res.status(200).json({ message: "Categoria editada com sucesso", category });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar a categoria", error });
  }
};