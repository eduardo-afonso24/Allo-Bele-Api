import { Response, Request } from "express";
import { BarberShopsServices, BarbersShops, ProfissionalService } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const getAllServicesByBarberShop = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const findBarberShops = await BarbersShops.findById(id);

    if (!findBarberShops) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }


    // Buscar todos os serviços que correspondem à barber shops
    const services = await BarberShopsServices.find({ barbersShopsId: id })
      .populate('category', '_id name')
      .lean();

    getIO().emit("servicesByBarberShops", services);

    // Retorna os serviços filtrados
    return res.status(200).json(services);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir lista de servicos." });
  }
};
