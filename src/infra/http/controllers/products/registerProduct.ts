import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { Brand, CategoryProduct, Products } from "../../../../shared";
import { getIO } from "../socket/sockets";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


export const registerProduct = async (req: Request, res: Response) => {
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
    }

    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    let imageURL = ""

    if (file && file.filepath) {
      imageURL = `/uploads/${path.basename(file.filepath)}`;
    }


    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const brand = Array.isArray(fields.brand) ? fields.brand[0] : fields.brand;

    if (!name || !price || !description) {
      return res.status(400).json({ message: "Os campos nomes e precos são obrigatórios." });
    }

    try {
      console.log({
        name,
        description,
        price,
        category,
        brand,
        image: imageURL,
      })
      const findCategory = await CategoryProduct.findById(category);
      if (!findCategory) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      const findBrand = await Brand.findById(category);
      if (!findBrand) {
        return res.status(404).json({ message: "Marca não encontrada" });
      }

      const produt = new Products({
        name,
        description,
        price,
        category,
        brand,
        image: imageURL,
      })

      await produt.save();
      const updateProduct = await Products.find({})
        .populate('category', '_id name')
        .populate('brand', '_id name')
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("products", updateProduct);

      res.status(200).json({ message: "Produto adicionado com sucesso", produts: produt });
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar o produto", error });
    }
  });
};