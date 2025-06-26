import { Response, Request } from "express";
import { Brand } from "../../../../shared";


export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const findBrand = await Brand.findById(id);
    if (!findBrand) {
      return res.status(404).json({ message: "Marca não encontrada" });
    }


    const brand = await Brand.findByIdAndUpdate(id, {
      name
    },
      { new: true })
      .lean();

    return res.status(200).json({ message: "Marca editada com sucesso", brand });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar a marca", error });
  }
};