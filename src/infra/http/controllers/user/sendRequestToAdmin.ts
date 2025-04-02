import { Response, Request } from "express";
import { ConfirmationRequets, User } from "../../../../shared";
import { getIO } from "../socket/sockets";


export const sendRequestToAdmin = async (req: Request, res: Response) : Promise<Response>  => {
  try {
    const { baberId, clientId, selectedServices, totalPrice, type_payment } = req.body;
    const baber = await User.findById(baberId);
    const client = await User.findById(clientId);

    if (!client || !baber) {
      return res.status(404).json({ message: 'Cliente ou Barbearia não encontrados.' });
    }

    if (!Array.isArray(selectedServices)) {
      console.log("selectedServices deve ser um array.")
      return res.status(400).json({ message: 'selectedServices deve ser um array.' });
    }


    const NewRequest = new ConfirmationRequets({
      clientId,
      clientName: client.name,
      baberId,
      baberName: baber.name,
      selectedServices,
      totalPrice,
      type_payment: type_payment,
    });

    await NewRequest.save();
    getIO().emit("sendRequestsToAdmin", NewRequest);
    res.status(200).json({ message: 'Os dados foram enviados com sucesso', NewRequest });
  } catch (error) {
    console.error('Erro ao enviar request', error);
    return res.status(500).json({ message: 'Erro ao enviar request.' });
  }
};