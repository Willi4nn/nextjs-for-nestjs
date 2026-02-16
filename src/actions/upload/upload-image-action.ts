'use server';

import { getLoginSessionForApi } from '@/lib/login/manage-login';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';

type UploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData
): Promise<UploadImageActionResult> {
  const makeResult = ({ url = '', error = '' }) => ({ url, error });

  // 1. Verificação de sessão (Segurança no Frontend)
  const isAuthenticated = await getLoginSessionForApi();
  if (!isAuthenticated) return makeResult({ error: 'Faça login novamente' });

  // 2. Validação básica de arquivo
  const file = formData.get('file');
  if (!(file instanceof File)) return makeResult({ error: 'Arquivo inválido' });

  // 3. Validação de Tamanho (Alinhado com os 900KB do NestJS)
  const uploadMaxSize =
    Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE) || 921600;
  if (file.size > uploadMaxSize) {
    return makeResult({ error: 'Arquivo muito grande (máximo 900KB)' });
  }

  // 4. Validação de Tipo de Imagem (Prevenção)
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type)) {
    return makeResult({
      error: 'Tipo de imagem não suportado (use PNG, JPEG ou WEBP)',
    });
  }

  try {
    // 5. Envio para o NestJS
    const uploadResponse = await authenticatedApiRequest<{ url: string }>(
      `/upload`,
      {
        method: 'POST',
        body: formData, // O fetch do Next.js trata o FormData e o Boundary automaticamente
      }
    );

    if (!uploadResponse.success) {
      // Retorna o primeiro erro vindo do NestJS (ex: erro do Cloudinary ou Multer)
      return makeResult({
        error: uploadResponse.errors?.[0] || 'Erro no servidor de upload',
      });
    }

    // 6. Sucesso: O NestJS retorna a URL segura do Cloudinary
    return makeResult({ url: uploadResponse.data.url });
  } catch (error) {
    console.error('Erro na Action de Upload:', error);
    return makeResult({ error: 'Erro inesperado ao processar o upload' });
  }
}
