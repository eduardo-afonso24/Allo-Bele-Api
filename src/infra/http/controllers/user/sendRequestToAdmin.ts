// sendRequestToAdmin.ts (backend)
import { Response, Request } from "express";
import { BarbersShops, ConfirmationRequets, User } from "../../../../shared";
import { getIO } from "../socket/sockets";

export const sendRequestToAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { clientId, selectedServices, totalPrice, type_payment, baberId } =
      req.body;

    // Validar cliente
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Validar selectedServices
    if (!Array.isArray(selectedServices)) {
      return res
        .status(400)
        .json({ message: "selectedServices deve ser um array." });
    }

    // Tentar encontrar o barbeiro ou a barbearia
    const barber = await User.findById(baberId);
    const barberShops = await BarbersShops.findById(baberId);
    const entity = barber || barberShops;

    if (!entity) {
      return res
        .status(404)
        .json({ message: "Barbeiro ou barbearia não encontrados." });
    }

    // Criar nova solicitação
    const NewRequest = new ConfirmationRequets({
      clientId,
      clientName: client.name,
      baberId,
      baberName: entity.name,
      selectedServices,
      totalPrice,
      type_payment,
    });

    await NewRequest.save();

    // Buscar e emitir todas as requisições atualizadas
    const updatedRequest = await ConfirmationRequets.find({})
      .populate("clientId", "_id image name email phone location")
      .populate("baberId", "_id image name email location")
      .sort({ timestamp: -1 })
      .lean();

    getIO().emit("AllRequest", updatedRequest);

    return res
      .status(200)
      .json({ message: "Os dados foram enviados com sucesso", NewRequest });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao enviar request." });
  }
};
