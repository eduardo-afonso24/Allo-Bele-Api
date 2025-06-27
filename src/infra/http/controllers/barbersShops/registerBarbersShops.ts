import { Response, Request } from "express";
import { BarbersShops } from "../../../../shared";

export const registerBarbersShops = async (req: Request, res: Response) => {
  const { name, password, phone, nif, type } = req.body;

  try {

    if (!name || !password || !phone || !type) {
      return res.status(400).json({ message: "Preencha todos os campos." });
    }

    const brand = new BarbersShops({
      name,
      password,
      phone,
      nif,
      type
    })

    await brand.save();

    res.status(200).json({ message: "Barbearia ou salão adicionado com sucesso", brand });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar a barbearia ou salão", error });
  }
};