import { Response, Request } from "express";
import { ProfissionalService } from "../../../../shared";


export const updateService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const { serviceName, price } = req.body;

  try {
    const findService = await ProfissionalService.findById(serviceId);
    if (!findService) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    const service = await ProfissionalService.findByIdAndUpdate(serviceId, {
      serviceName,
      price,
    },
      { new: true });

    res.status(200).json({ message: "Serviço editado com sucesso", service });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar serviço", error });
  }
};