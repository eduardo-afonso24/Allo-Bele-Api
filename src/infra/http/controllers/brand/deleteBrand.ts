import { Response, Request } from "express";
import { Brand } from "../../../../shared";


export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const findService = await Brand.findById(id);
    if (!findService) {
      return res.status(404).json({ message: "Marca não encontrado" });
    }

    await Brand.findByIdAndDelete(id);

    res.status(200).json({ message: "Marca removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover a marca", error });
  }
};