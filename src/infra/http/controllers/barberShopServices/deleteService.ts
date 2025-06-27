import { Response, Request } from "express";
import { BarberShopsServices, ProfissionalService } from "../../../../shared";
import { getIO } from "../socket/sockets";


export const deleteService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  try {
    const findService = await BarberShopsServices.findById(serviceId);
    if (!findService) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    await BarberShopsServices.findByIdAndDelete(serviceId);
    const updatedServices = await BarberShopsServices.find({})
      .populate('category', '_id name')
      .sort({ timestamp: -1 })
      .lean();
    getIO().emit("barberShopsServices", updatedServices);

    res.status(200).json({ message: "Serviço removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover serviço", error });
  }
};