import { Response, Request } from "express";
import { User, ProfissionalService, Category } from "../../../../shared";

export const registerService = async (req: Request, res: Response) => {
  const { name, price, description, category } = req.body;

  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const findCategory = await Category.findById(category);
    if (!findCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    if (!name || !price) {
      return res.status(400).json({ message: "Os campos nomes e precos são obrigatórios." });
    }

    const service = new ProfissionalService({
      serviceName: name,
      description,
      price,
      userId,
      category
    })

    await service.save();

    res.status(200).json({ message: "Serviço adicionado com sucesso", services: service });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar serviço", error });
  }
};