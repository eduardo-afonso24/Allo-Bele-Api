import { Response, Request } from "express";
import { ConfirmationRequets } from "../../../../shared";


export const getAllConfirmedRequestByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const request = await ConfirmationRequets.find({ confirmed: true })
      .populate('clientId', '_id image name email')
      .populate('baberId', '_id image name email').sort({ createdAt: -1 });
    const requests = request.filter(item => String(item.clientId._id) === userId || String(item.baberId._id) === userId);

    return res.status(200).json(requests);
  } catch (error) {
    console.error('Erro ao listar os pedidos (chamadas) confirmados', error);
    return res.status(500).json({ message: 'Erro ao listar os pedidos (chamadas) confirmados.' });
  }
};







// import { Response, Request } from "express";
// import { ConfirmationRequets } from "../../../../shared";


// export const getAllConfirmedRequestByUserId = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const request = await ConfirmationRequets.find({ clientId: userId })
//       .populate('clientId', '_id image name email')
//       .populate('baberId', '_id image name email').sort({ createdAt: -1 });
//     const requests = request.filter(item => item.confirmed === true);

//     console.log({ request })
//     console.log({ requests })
//     return res.status(200).json(requests);
//   } catch (error) {
//     console.error('Erro ao listar os pedidos (chamadas) confirmados', error);
//     return res.status(500).json({ message: 'Erro ao listar os pedidos (chamadas) confirmados.' });
//   }
// };