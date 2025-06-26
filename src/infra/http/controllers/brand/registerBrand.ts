import { Response, Request } from "express";
import { Brand } from "../../../../shared";

export const registerBrand = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {

    if (!name) {
      return res.status(400).json({ message: "o nome é obrigatório." });
    }

    const brand = new Brand({
      name
    })

    await brand.save();

    res.status(200).json({ message: "Marca adicionado com sucesso", brand });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar a marca", error });
  }
};