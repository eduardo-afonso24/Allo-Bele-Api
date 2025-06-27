import { Response, Request } from "express";
import { BarbersShops } from "../../../../shared";

export const registerBarbersShops = async (req: Request, res: Response) => {
  const { name, password, phone, nif, type } = req.body;

  try {

    console.log({
      name,
      password,
      phone,
      nif,
      type
    })
    if (!name || !password || !phone || !type) {
      console.log("Preencha todos os campos.");
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
    console.log({ error: error })
    res.status(500).json({ message: "Erro ao adicionar a barbearia ou salão", error });
  }
};