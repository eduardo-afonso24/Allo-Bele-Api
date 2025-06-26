import { Response, Request } from "express";
import { Brand } from "../../../../shared";

export const getAllBrand = async (
  _: Request,
  res: Response
): Promise<Response> => {
  try {
    const brand = await Brand.find()
      .sort({ timestamp: -1 })
      .lean();
    return res.status(200).json(brand);
  } catch (error) {
    console.error("Erro ao imprimir lista de todos as marcas:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de todos as marcas." });
  }
};