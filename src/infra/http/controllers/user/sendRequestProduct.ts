import { Response, Request } from "express";
import { Products, RequestProducts } from "../../../../shared";

export const sendRequestProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, phone, address, price, payment, products, deviceId } = req.body;

    console.log("CHAMANDO")
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Lista de produtos inválida.' });
    }

    const productIds = products.map((p) => p._id);
    const foundProducts = await Products.find({ _id: { $in: productIds } });
    console.log({ foundProducts: foundProducts })
    console.log({ productIds: productIds })
    console.log({ products: products })

    if (foundProducts.length !== products.length) {
      return res.status(404).json({ message: 'Um ou mais produtos não foram encontrados.' });
    }

    const newRequest = new RequestProducts({
      name,
      phone,
      address,
      price,
      payment,
      deviceId,
      products: products.map(p => ({
        product: p._id,
        quantity: p.quantity,
      }))
    });

    await newRequest.save();

    return res.status(200).json({ message: 'Pedido enviado com sucesso!', newRequest });

  } catch (error) {
    console.error('Erro ao enviar pedido:', error);
    return res.status(500).json({ message: 'Erro interno ao enviar pedido.' });
  }
};
