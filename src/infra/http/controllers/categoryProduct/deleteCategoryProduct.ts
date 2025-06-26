import { Response, Request } from "express";
import { CategoryProduct } from "../../../../shared";


export const deleteCategoryProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const findService = await CategoryProduct.findById(id);
    if (!findService) {
      return res.status(404).json({ message: "Categoria do produto não encontrado" });
    }

    await CategoryProduct.findByIdAndDelete(id);

    res.status(200).json({ message: "Categoria do produto removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover a categoria do produto", error });
  }
};