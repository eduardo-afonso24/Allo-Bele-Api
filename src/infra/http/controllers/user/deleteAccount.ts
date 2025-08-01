import { Response, Request } from "express";
import mongoose from "mongoose";
import { User } from "../../../../shared";

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("APAGANDO CONTA : ", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    console.log("USUARIO APAGADO : ", user)
    return res.status(200).json({ message: "Usuário apagado com sucesso!" });

  } catch (error) {
    console.error("Erro ao apagar o usuário:", error);
    return res.status(500).json({ message: "Ocorreu um erro ao apagar os dados do usuário." });
  }
};
