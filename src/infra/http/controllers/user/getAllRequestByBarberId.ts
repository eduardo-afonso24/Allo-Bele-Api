
import { Response, Request } from "express";
import { ConfirmationRequets, User } from "../../../../shared";


export const getAllRequestByBarberId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { baberId } = req.params;
    const request = await ConfirmationRequets.find({ baberId })
      .populate('clientId', '_id image address');

    return res.status(200).json(request);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir historico de chamadas." });
  }
};