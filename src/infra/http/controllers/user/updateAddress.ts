import { Response, Request } from "express";
import { User } from "../../../../shared";


export const updateAddress = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;
        const { address } = req.body;

        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(404).json({
                message: "Usuário não encontrado.",
            });
        }
        findUser.address = address;
        const user = await findUser.save();

        return res.status(200).json({ user });

    } catch (error) {
        return res.status(500).json({ message: "Ocorreu um erro no forgot password." });
    }
};