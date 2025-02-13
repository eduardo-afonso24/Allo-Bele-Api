import { Response, Request } from "express";
import { ConfirmationRequets } from "../../../../shared";


export const confirmRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { confirmed } = req.body;
  try {

    const findRequest = await ConfirmationRequets.findById(requestId);
    if (!findRequest) {
      return res.status(404).json({ message: "Pedido(chamada) não encontrado" });
    }

    const request = await ConfirmationRequets.findByIdAndUpdate(requestId, {
      confirmed
    },
      { new: true });
    return res.status(200).json(request);
  } catch (error) {
    console.error('Erro ao confirmar o pedido (chamada)', error);
    return res.status(500).json({ message: 'Erro ao confirmar o pedido (chamada).' });
  }
};