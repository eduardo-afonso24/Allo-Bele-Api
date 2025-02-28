// import { Response, Request } from "express";
// import { User } from "../../../../shared";


// export const resetPassword = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { email } = req.body;

//     console.log({ email })

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "User nao existe." });
//     }

//      const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//           return res.status(401).json({ message: "Credenciais inválidas." });
//         }

//     // Retorna o usuário e o token de recuperação
//     return res.status(200).json({ user });
//   } catch (error) {
//     console.error("Erro no forgot password :", error);
//     return res.status(500).json({ message: "Ocorreu um erro no forgot password." });
//   }
// };