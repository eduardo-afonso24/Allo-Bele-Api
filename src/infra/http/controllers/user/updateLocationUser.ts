import { Response, Request } from "express";
import { User } from "../../../../shared";
import { getIO } from "../socket/sockets";


export const updateLocationUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    console.log({ latitude, longitude })

    if (!latitude || !longitude) {
      return res.status(404).json({ message: 'Latitude e Longitude são obrigatorios.' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    user.location.latitude = Number(latitude);
    user.location.longitude = Number(longitude);

    const updatedUser = await user.save();
    console.log({ updatedUser })
    getIO().emit("updateLocation", updatedUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao enviar a localizacao do usuario:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao enviar a localizacao do usuario." });
  }
};