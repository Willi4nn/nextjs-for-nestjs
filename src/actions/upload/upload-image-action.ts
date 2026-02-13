'use server';

import { getLoginSessionForApi } from '@/lib/login/manage-login';
import { v2 as cloudinary } from 'cloudinary';

type UploadImageActionResult = {
  url: string;
  error: string;
};

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função server action para processar upload de imagem
export async function uploadImageAction(
  formData: FormData
): Promise<UploadImageActionResult> {
  // Função auxiliar para padronizar o retorno
  const makeResult = ({ url = '', error = '' }) => ({ url, error });

  const isAuthenticated = await getLoginSessionForApi();

  if (!isAuthenticated) {
    return makeResult({ error: 'Faça login novamente.' });
  }

  // Valida se o formData é válido
  if (!(formData instanceof FormData)) {
    return makeResult({ error: 'Dados do formulário inválidos.' });
  }

  // Obtém o arquivo enviado
  const file = formData.get('file');

  // Valida se o arquivo é válido
  if (!(file instanceof File)) {
    return makeResult({ error: 'Arquivo de imagem inválido.' });
  }

  // Valida tamanho máximo
  const imageUploadMaxSize =
    Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE) || 5242880;
  if (file.size > imageUploadMaxSize) {
    return makeResult({
      error: 'O tamanho do arquivo excede o limite de 5MB.',
    });
  }

  // Valida se é uma imagem
  if (!file.type.startsWith('image/')) {
    return makeResult({ error: 'O arquivo enviado não é uma imagem.' });
  }

  try {
    // Converte o arquivo para buffer
    const fileArrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileArrayBuffer);

    // Faz upload para o Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'blog-posts',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string });
          }
        );

        uploadStream.end(buffer);
      }
    );

    return makeResult({ url: uploadResult.secure_url });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return makeResult({ error: 'Erro ao fazer upload da imagem.' });
  }
}
