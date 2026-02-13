'use server';

import {
  makePartialPublicPost,
  makePublicPostFromDb,
  PublicPost,
} from '@/dto/post/dto';
import { getLoginSessionForApi } from '@/lib/login/manage-login';
import { PostUpdateSchema } from '@/lib/post/validations';
import { postRepository } from '@/repositories/post';
import { getZodErrorMessages } from '@/utils/get-zod-error-mensages';
import { makeRandomString } from '@/utils/make-random-string';
import { revalidateTag } from 'next/cache';

type UpdatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

// Server Action: processa formulário de criação/edição de posts
export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData
): Promise<UpdatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados do formulário inválidos.'],
    };
  }

  const id = formData.get('id')?.toString() || '';

  if (!id || typeof id !== 'string') {
    return {
      formState: prevState.formState,
      errors: ['ID do post inválido.'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostUpdateSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: makePartialPublicPost(formDataToObj),
      errors: ['Faça login em outra aba e tente novamente.'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicPost(formDataToObj),
    };
  }

  const validPostData = zodParsedObj.data;
  const newPost = {
    ...validPostData,
  };

  let post;
  try {
    post = await postRepository.update(id, newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: makePartialPublicPost(formDataToObj),
        errors: [e.message],
      };
    }

    return {
      formState: makePartialPublicPost(formDataToObj),
      errors: ['Erro desconhecido ao criar o post.'],
    };
  }

  revalidateTag('posts', 'default');
  revalidateTag(`post-${post.slug}`, 'default');

  return {
    formState: makePublicPostFromDb(post),
    errors: [],
    success: makeRandomString(),
  };
}
