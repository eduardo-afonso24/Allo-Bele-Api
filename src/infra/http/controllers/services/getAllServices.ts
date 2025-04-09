import { Response, Request } from "express";
import { ProfissionalService, User } from "../../../../shared";

export const getAllServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Definir o valor de "to" de acordo com a profissão do usuário
    let professionValue: number;
    switch (user.profession) {
      case "Barbeiros":
        professionValue = 1;
        break;
      case "Barbeiro":
        professionValue = 1;
        break;
      case "Esteticista":
        professionValue = 2;
        break;
      case "Cabelereiro(a)":
        professionValue = 3;
        break;
      case "MakeUp":
        professionValue = 4;
        break;
      case "Massagista":
        professionValue = 5;
        break;
      default:
        professionValue = 0; // Para o caso de "Todos"
        break;
    }

    // Buscar todos os serviços que correspondem à profissão do usuário
    const services = await ProfissionalService.find({ to: professionValue })
      .lean();

    console.log({ user: user });
    console.log({ services: services });

    // Retorna os serviços filtrados
    return res.status(200).json(services);
  } catch (error) {
    console.error("Erro ao imprimir lista de servicos:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de servicos." });
  }
};
