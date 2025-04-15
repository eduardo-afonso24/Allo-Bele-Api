import { Response, Request } from "express";
import { ProfissionalService, Pubs, User } from "../../../../shared";


export const deletePubs = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const findPubs = await Pubs.findById(id);
    if (!findPubs) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    await Pubs.findByIdAndDelete(id);

    res.status(200).json({ message: "Post removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover post", error });
  }
};