import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import jwt from "jsonwebtoken";
import { Fields, Files, IncomingForm } from "formidable";
import { Response, Request } from "express";
import { User } from "../../../../shared";

const __currentDirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__currentDirname, '../../../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

export const updateUserAvatars = async (req: Request, res: Response) => { // Renomeado
    const form = new IncomingForm({ uploadDir, keepExtensions: true, multiples: true });

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer upload do arquivo.' });
        }

        const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
        const avatars = files.avatar; // Novos arquivos de avatar (URIs locais do frontend)
        const existingAvatarUrlsField = Array.isArray(fields.existingAvatarUrls) ? fields.existingAvatarUrls[0] : fields.existingAvatarUrls; // URLs existentes a serem mantidas

        try {
            const existingUser = await User.findById(id);
            if (!existingUser) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            let newUploadedAvatarUrls: string[] = [];
            if (avatars) {
                const avatarArray = Array.isArray(avatars) ? avatars : [avatars];
                newUploadedAvatarUrls = avatarArray
                    .filter(file => file && file.filepath)
                    .map(file => `/uploads/${path.basename(file.filepath)}`);
            }

            // Parseia as URLs existentes que o frontend enviou para manter
            let existingUrlsToKeep: string[] = [];
            if (existingAvatarUrlsField) {
                try {
                    existingUrlsToKeep = JSON.parse(existingAvatarUrlsField);
                    // Filtra para garantir que são URLs válidas do servidor (começando com /uploads)
                    existingUrlsToKeep = existingUrlsToKeep.filter(url => url.startsWith('/uploads/'));
                } catch (parseError) {
                    console.warn("Erro ao parsear existingAvatarUrls:", parseError);
                    existingUrlsToKeep = []; // Se houver erro, ignora as URLs existentes enviadas
                }
            }

            // Combina as URLs existentes a serem mantidas com as novas URLs carregadas
            // Garante que não haja duplicatas e que a ordem possa ser mantida se for importante
            const finalAvatars = [...new Set([...existingUrlsToKeep, ...newUploadedAvatarUrls])];

            // --- Lógica para deletar arquivos antigos não mais referenciados (OPCIONAL, mas RECOMENDADO) ---
            // Isso é importante para evitar que seu diretório 'uploads' acumule lixo.
            const oldAvatars = existingUser.avatar || []; // Avatares que o usuário tinha antes da atualização

            oldAvatars.forEach(oldUrl => {
                // Verifica se a URL antiga não está na lista final de avatares
                // E se ela realmente é um arquivo local (para não tentar deletar URLs externas se houver)
                if (!finalAvatars.includes(oldUrl) && oldUrl.startsWith('/uploads/')) {
                    const filePathToDelete = path.join(uploadDir, path.basename(oldUrl));
                    fs.unlink(filePathToDelete, (err) => {
                        if (err) console.error(`Erro ao deletar arquivo antigo ${filePathToDelete}:`, err);
                        else console.log(`Arquivo antigo deletado: ${filePathToDelete}`);
                    });
                }
            });
            // --- Fim da lógica de deleção ---


            const user = await User.findByIdAndUpdate(existingUser._id, {
                avatar: finalAvatars, // Atualiza o campo 'avatar' com o array final de URLs
            }, { new: true });

            if (!user) {
                return res.status(500).json({ message: "Falha ao atualizar o usuário." });
            }

            const token = jwt.sign({ userId: user._id, role: user.role }, "alloBelleSecretKey01", {
                expiresIn: "60d",
            });
            return res.status(200).json({ user, token });
        } catch (error) {
            return res.status(500).json({ message: "Ocorreu um erro ao atualizar as imagens do usuário." });
        }
    });
};