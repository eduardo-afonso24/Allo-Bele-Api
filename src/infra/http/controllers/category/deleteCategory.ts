import { Response, Request } from "express";
import { Category } from "../../../../shared";


export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const findCategory = await Category.findById(id);
    if (!findCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Categoria removida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover a categoria", error });
  }
};