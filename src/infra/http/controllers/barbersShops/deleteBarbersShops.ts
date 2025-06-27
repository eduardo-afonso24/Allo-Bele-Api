import { Response, Request } from "express";
import { BarbersShops } from "../../../../shared";


export const deleteBarbersShops = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const findService = await BarbersShops.findById(id);
    if (!findService) {
      return res.status(404).json({ message: "Barbearia ou salão não encontrado" });
    }

    await BarbersShops.findByIdAndDelete(id);

    res.status(200).json({ message: "Barbearia ou salão removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover a barbearia ou salão", error });
  }
};