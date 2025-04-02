
import { Response, Request } from "express";
import { ProfissionalService, User } from "../../../../shared";


export const getAllServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    // if (user.role === 'barber') {

    // }
    const services = await ProfissionalService.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(services);
  } catch (error) {
    console.error("Erro ao imprimir lista de servicos:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de servicos." });
  }
};