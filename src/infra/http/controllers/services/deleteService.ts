import { Response, Request } from "express";
import { ProfissionalService } from "../../../../shared";


export const deleteService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  try {
    const findService = await ProfissionalService.findById(serviceId);
    if (!findService) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    await ProfissionalService.findByIdAndDelete(serviceId);

    res.status(200).json({ message: "Serviço removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover serviço", error });
  }
};