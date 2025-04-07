import { Response, Request } from "express";
import { ConfirmationRequets } from "../../../../shared";


export const getAllRequestById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const request = await ConfirmationRequets.findById(id)
      .populate('clientId', '_id image name')
      .populate('baberId', '_id image name')
      .lean();

    return res.status(200).json(request);
  } catch (error) {
    console.error("Erro ao imprimir historico de chamadas:", error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir historico de chamadas." });
  }
};