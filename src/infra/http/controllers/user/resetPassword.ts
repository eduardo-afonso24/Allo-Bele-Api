import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { BarbersShops, User } from "../../../../shared";


export const resetPassword = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { email, password } = req.body;

        const findUser = await User.findOne({ email });
        if (findUser) {
            let hashedPassword = ''
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            findUser.password = hashedPassword;
            const user = await findUser.save();

            return res.status(200).json({ user });
        }





        const barbershop = await BarbersShops.findOne({ email });

        if (barbershop) {
            let hashedPassword = ''
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            barbershop.password = hashedPassword;
            const user = await barbershop.save();

            return res.status(200).json({ user });
        }

    } catch (error) {
        return res.status(500).json({ message: "Ocorreu um erro no forgot password." });
    }
};