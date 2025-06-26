import { Response, Request } from "express";
import { CategoryProduct } from "../../../../shared";


export const updateCategoryProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const findBrand = await CategoryProduct.findById(id);
    if (!findBrand) {
      return res.status(404).json({ message: "Marca não encontrada" });
    }


    const category = await CategoryProduct.findByIdAndUpdate(id, {
      name
    },
      { new: true })
      .lean();

    return res.status(200).json({ message: "Categoria de produto editada com sucesso", category });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar a categoria de produto", error });
  }
};