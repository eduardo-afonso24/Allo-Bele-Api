import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import { User } from "../../../../shared";


export const socialLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, name, phone, gender, image } = req.body;

    console.log({ email })

    const findUser = await User.findOne({ email });
    if (findUser) {
      const role = findUser.role
      const token = jwt.sign({ userId: findUser._id, role }, "alloBelleSecretKey01", {
        expiresIn: "60d",
      });

      // Retorna o usuário e o token de autenticação
      return res.status(200).json({ user: findUser, token });
    }


    const user = new User({
      name,
      email,
      phone,
      gender,
      image,
      role: "client"
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, "alloBelleSecretKey01", {
      expiresIn: "60d",
    });

    return res.status(201).json({ user, token });


  } catch (error) {
    console.error("Erro ao fazer o login social:", error);
    return res.status(500).json({ message: "Ocorreu um erro ao fazer o login social." });
  }
};