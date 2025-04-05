// import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

type IEmailItems = {
    to: string;
    subject: string;
    text?: string;
    html: string;
};

export class SendMail {
    async execute({ to, subject, html, text }: IEmailItems): Promise<any> {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: "edochagamer615@gmail.com",
                    pass: "rinrnuyzrqwmiexk",
                },
            });

            await transporter.sendMail({
                from: "Alo-Belle <edochagamer615@gmail.com>",
                to,
                subject,
                html,
                text,
            });
            console.log({ message: "email enviado com sucesso" });
            return true;
        } catch (error: any) {
            return console.log({ error_send_email: error });
        }
    }
}