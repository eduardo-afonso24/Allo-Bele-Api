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







// import nodemailer from 'nodemailer';

// type IEmailItems = {
//     to: string;
//     subject: string;
//     text?: string;
//     html: string;
// };

// export class SendMail {
//     async execute({ to, subject, html, text }: IEmailItems): Promise<any> {
//         try {
//             // Criação do transporter com as configurações do SMTP do seu domínio
//             const transporter = nodemailer.createTransport({
//                 host: 'mail.alobele.com', // SMTP server do seu domínio
//                 port: 465, // Porta segura, geralmente 465 ou 587 para SMTP
//                 secure: true, // Usar conexão segura
//                 auth: {
//                     user: 'system@alobele.com', // Seu e-mail de autenticação
//                     pass: 'Alobele.2025', // A senha da conta de e-mail
//                 },
//             });

//             // Enviar o e-mail
//             await transporter.sendMail({
//                 from: 'Alo-Belle <system@alobele.com>', // Remetente
//                 to,
//                 subject,
//                 html,
//                 text,
//             });

//             console.log({ message: 'E-mail enviado com sucesso' });
//             return true;
//         } catch (error: any) {
//             console.log({ error_send_email: error });
//             return false;
//         }
//     }
// }
