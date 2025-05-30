import { Response, Request } from "express";
import { User } from "../../../../shared";


export const lockAndUnlockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {

    const findRequest = await User.findById(id);
    if (!findRequest) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    const request = await User.findByIdAndUpdate(id, {
      status: status
    },
      { new: true });
    return res.status(200).json(request);
  } catch (error) {
    console.error('Erro ao bloquear ou desbloquear o usuario', error);
    return res.status(500).json({ message: 'Erro ao bloquear ou desbloquear o usuario.' });
  }
};