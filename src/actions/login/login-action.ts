'use server';

import { createLoginSessionFromApi } from '@/lib/login/manage-login';
import { LoginSchema } from '@/lib/login/schemas';
import { apiRequest } from '@/utils/api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-mensages';
import { verifyHoneypotInput } from '@/utils/verify-honeypot-input';
import { redirect } from 'next/navigation';

type LoginActionState = {
  email: string;
  errors: string[];
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN) || 0);

  if (!allowLogin) {
    return {
      email: '',
      errors: ['Logins estão desabilitados no momento.'],
    };
  }

  const isBot = await verifyHoneypotInput(formData, 5000);

  if (isBot) {
    return {
      email: '',
      errors: ['Detecção de bot ativada. Acesso negado.'],
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      email: '',
      errors: ['Formulário inválido.'],
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const formEmail = formObj?.email?.toString() || '';
  const parsedFormData = LoginSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      email: formEmail,
      errors: getZodErrorMessages(parsedFormData.error),
    };
  }

  const loginResponse = await apiRequest<{ accessToken: string }>(
    '/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedFormData.data),
    }
  );

  if (!loginResponse.success) {
    return {
      email: formEmail,
      errors: loginResponse.errors,
    };
  }

  console.log(
    'Login bem-sucedido. Token de acesso:',
    loginResponse.data.accessToken
  );

  await createLoginSessionFromApi(loginResponse.data.accessToken);
  redirect('/admin/post');
}
