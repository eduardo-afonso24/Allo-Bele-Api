
import { Response, Request } from "express";
import { BarbersShops, User } from "../../../../shared";


export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      return res.status(200).json(user);
    }

    const barberShop = await BarbersShops.findById(id);
    if (barberShop) {
      return res.status(200).json(barberShop);
    }

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao imprimir informacoes do usuario." });
  }
};