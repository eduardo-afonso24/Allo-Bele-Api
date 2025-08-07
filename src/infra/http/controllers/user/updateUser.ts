import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import jwt from "jsonwebtoken";
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { BarbersShops, User } from "../../../../shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const updateUser = async (req: Request, res: Response) => {
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
    }

    const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;

    const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
    // const gender = Array.isArray(fields.gender) ? fields.gender[0] : fields.gender;
    const profession = Array.isArray(fields.profession) ? fields.profession[0] : fields.profession;


    try {
      const existingUser = await User.findById(id);
      if (existingUser) {
        let avatarUrl = ""

        if (file && file.filepath) {
          avatarUrl = `/uploads/${path.basename(file.filepath)}`;
        }

        console.log({
          existingUser: existingUser
        })

        console.log("DADOS DO FORMULARIO > ", {
          name: name,
          email: email,
          phone: phone,
          address: address,
          image: avatarUrl,
          profession: profession,
        })

        console.log("DADOS DO ENDERECO > ", {
          address: address ? address : existingUser.address,
        })

        console.log("DADOS NORMAIS", {
          name: name ? name : existingUser.name,
          email: email ? email : existingUser.email,
          phone: phone ? phone : existingUser.phone,
          address: address ? address : existingUser.address,
          // gender: gender ? gender : existingUser.gender,
          image: avatarUrl ? avatarUrl : existingUser.image,
          profession: profession ? profession : existingUser.profession,
        })

        const user = await User.findByIdAndUpdate(existingUser._id, {
          name: name ? name : existingUser.name,
          email: email ? email : existingUser.email,
          phone: phone ? phone : existingUser.phone,
          address: address ? address : existingUser.address,
          // gender: gender ? gender : existingUser.gender,
          image: avatarUrl ? avatarUrl : existingUser.image,
          profession: profession && profession !== "null" ? profession : existingUser.profession,
        },
          { new: true });

        const token = jwt.sign({ userId: user._id, role: user.role }, "alloBelleSecretKey01", {
          expiresIn: "60d",
        });
        return res.status(200).json({ user, token });
      }

      const existingBarberShops = await BarbersShops.findById(id);
      if (existingBarberShops) {
        let avatarUrl = ""

        if (file && file.filepath) {
          avatarUrl = `/uploads/${path.basename(file.filepath)}`;
        }

        console.log({
          name: name ? name : existingBarberShops.name,
          email: email ? email : existingBarberShops.email,
          phone: phone ? phone : existingBarberShops.phone,
          address: address ? address : existingBarberShops.address,
          image: avatarUrl ? avatarUrl : existingBarberShops.image,
        })

        const user = await BarbersShops.findByIdAndUpdate(existingBarberShops._id, {
          name: name ? name : existingBarberShops.name,
          email: email ? email : existingBarberShops.email,
          phone: phone ? phone : existingBarberShops.phone,
          address: address ? address : existingBarberShops.address,
          image: avatarUrl ? avatarUrl : existingBarberShops.image,
        },
          { new: true });

        const token = jwt.sign({ userId: user._id, role: user.role }, "alloBelleSecretKey01", {
          expiresIn: "60d",
        });
        return res.status(200).json({ user, token });
      }


    } catch (error) {
      console.error("Erro ao atualizar os dados do usuário:", error);
      return res.status(500).json({ message: "Ocorreu um erro ao r os dados do usuário." });
    }
  });
};