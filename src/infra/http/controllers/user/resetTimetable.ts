import { Response, Request } from "express";
import { BarbersShops, User } from "../../../../shared";


export const resetTimetable = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { email, time } = req.body;

        console.log({ email })


        const findUser = await User.findOne({ phone: email });

        if (findUser) {
            findUser.hours = time;
            const user = await findUser.save();
            return res.status(200).json({ user });
        }




        const barbershop = await BarbersShops.findOne({ phone: email });

        if (barbershop) {
            barbershop.hours = time;
            const user = await barbershop.save();
            return res.status(200).json({ user });
        }


    } catch (error) {
        return res.status(500).json({ message: "Ocorreu um erro no edit hour." });
    }
};