import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { Promotions } from "../../../../shared";
import { getIO } from "../socket/sockets";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const registerPromotions = async (req: Request, res: Response) => {
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao fazer upload do arquivo." });
    }

    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    let imageURL = "";

    if (file && file.filepath) {
      const ext = path.extname(file.originalFilename || file.filepath);
      const filename = `${Date.now()}_${Math.round(Math.random() * 1e5)}${ext}`;
      const newPath = path.join(uploadDir, filename);
      fs.renameSync(file.filepath, newPath);
      imageURL = `/uploads/${filename}`;
    }

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const brand = Array.isArray(fields.brand) ? fields.brand[0] : fields.brand;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;
    try {
      const promotions = new Promotions({
        title,
        description,
        brand,
        image: imageURL,
      });

      await promotions.save();
      const updatePromotions = await Promotions.find({})
        .sort({ timestamp: -1 })
        .lean();
      getIO().emit("promotions", updatePromotions);

      res.status(200).json({
        message: "promotions adicionado com sucesso",
        promotions: promotions,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao adicionar o promotions", error });
    }
  });
};
