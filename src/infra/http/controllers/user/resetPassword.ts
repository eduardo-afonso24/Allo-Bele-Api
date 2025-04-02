import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { User } from "../../../../shared";


export const resetPassword = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { email, password } = req.body;

        console.log({ email })

        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ message: "User nao existe." });
        }

        let hashedPassword = ''
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        findUser.password = hashedPassword;
        const user = await findUser.save();

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Erro no forgot password :", error);
        return res.status(500).json({ message: "Ocorreu um erro no forgot password." });
    }
};