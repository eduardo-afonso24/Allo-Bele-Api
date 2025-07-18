
import { Response, Request } from "express";
import { BarberShopsServices, ProfissionalService } from "../../../../shared";
import { getIO } from "../socket/sockets";


export const getServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const services = await BarberShopsServices.find({})
      .populate('category', '_id name')
      .sort({ timestamp: -1 })
      .lean();
    getIO().emit("barberShopsServices", services);
    return res.status(200).json(services);
  } catch (error) {
    console.error("Erro ao imprimir lista de servicos:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de servicos." });
  }
};