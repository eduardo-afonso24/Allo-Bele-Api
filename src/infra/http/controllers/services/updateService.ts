import { Response, Request } from "express";
import { ProfissionalService } from "../../../../shared";


export const updateService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const { serviceName, price, category, description } = req.body;

  try {
    const findService = await ProfissionalService.findById(serviceId);
    if (!findService) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    console.log({
      serviceName: serviceName?.trim() !== "" ? serviceName : findService.serviceName,
      price: price ? price : findService.price,
      category: category ? category : findService.category,
      description: description ? description : findService.description,
    })
    const service = await ProfissionalService.findByIdAndUpdate(serviceId, {
      serviceName: serviceName ? serviceName : findService.serviceName,
      price: price ? price : findService.price,
      category: category ? category : findService.category,
      description: description ? description : findService.description,
    },
      { new: true });

    console.log({ service })

    console.log({ serviceName, price, category, description })

    res.status(200).json({ message: "Serviço editado com sucesso", service });
  } catch (error) {
    console.log({ error })
    res.status(500).json({ message: "Erro ao editar serviço", error });
  }
};