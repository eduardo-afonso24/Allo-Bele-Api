import { Response } from 'express'; // Importe Response de 'express' se estiver utilizando o Express

interface User {
  generateToken(): string; // Assumindo que generateToken() retorna uma string
}

interface CookieOptions {
  expires: Date;
  // Adicione outros campos de opções de cookie conforme necessário
}

const cookieOptions: CookieOptions = {
  expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  // Adicione outros campos de opções de cookie conforme necessário
};

export const sendToken = (user: User, res: Response, message: string, statusCode: number): void => {
  const token: string = user.generateToken();

    


  res
    .status(statusCode)
    .cookie("token", token, {
      ...cookieOptions,
      expires: cookieOptions.expires,
    })
    .json({
      success: true,
      message: message,
    });
};
