import { Response, Request } from "express";
import { Products } from "../../../../shared";
import { getIO } from "../socket/sockets";


export const deleteProducts = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const findProduct = await Products.findById(id);
    if (!findProduct) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    await Products.findByIdAndDelete(id);
    const updateProduct = await Products.find({})
      .populate('category', '_id name')
      .populate('brand', '_id name')
      .sort({ timestamp: -1 })
      .lean();
    getIO().emit("products", updateProduct);

    res.status(200).json({ message: "Produto removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover produto", error });
  }
};