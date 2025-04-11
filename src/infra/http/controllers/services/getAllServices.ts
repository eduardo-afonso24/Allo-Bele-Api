import { Response, Request } from "express";
import { Category, ProfissionalService, User } from "../../../../shared";

export const getAllServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { category } = req.params;

    const findCategory = await Category.findById(category);

    if (!findCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }


    // Buscar todos os serviços que correspondem à categoria
    const services = await ProfissionalService.find({ category: category })
      .lean();

    console.log({ findCategory: findCategory });
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
