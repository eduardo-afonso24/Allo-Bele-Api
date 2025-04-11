import { Response, Request } from "express";
import { Category } from "../../../../shared";

export const getAllCategory = async (
  _: Request,
  res: Response
): Promise<Response> => {
  try {
    const category = await Category.find()
      .sort({ timestamp: -1 })
      .lean();

    return res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao imprimir lista de todas as categorias:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de todos os agendamentos." });
  }
};