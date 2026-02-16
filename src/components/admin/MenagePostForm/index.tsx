'use client';

import { createPostAction } from '@/actions/post/create-post-action';
import { updatePostAction } from '@/actions/post/update-post-action';
import InputText from '@/components/InputText';
import {
  PublicPostForApiDto,
  PublicPostForApiSchema,
} from '@/lib/post/schemas';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../Button';
import InputCheckbox from '../../InputCheckbox';
import { MarkdownEditor } from '../../MarkdownEditor';
import ImageUploader from '../ImageUploader';

type MenagePostFormUpdateProps = {
  mode: 'update';
  publicPost?: PublicPostForApiDto;
};
type MenagePostFormCreateProps = {
  mode: 'create';
};
type MenagePostFormProps =
  | MenagePostFormUpdateProps
  | MenagePostFormCreateProps;

export default function MenagePostForm(props: MenagePostFormProps) {
  const { mode } = props;
  const searchParams = useSearchParams();
  const created = searchParams.get('created');
  const router = useRouter();

  let publicPost;
  if (mode === 'update') {
    publicPost = props.publicPost;
  }

  const actionsMap = {
    update: updatePostAction,
    create: createPostAction,
  };

  const initialState = {
    formState: PublicPostForApiSchema.parse(publicPost || {}),
    errors: [],
  };

  const [state, action, isPending] = useActionState(
    actionsMap[mode],
    initialState
  );

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach((error) => toast.error(error));
    }
  }, [state.errors]);

  useEffect(() => {
    if (state.success) {
      toast.dismiss();
      toast.success('Post atualizado com sucesso!');
    }
  }, [state.success]);

  useEffect(() => {
    if (created === '1') {
      toast.dismiss();
      toast.success('Post criado com sucesso!');
      const url = new URL(window.location.href);
      url.searchParams.delete('created');
      router.replace(url.toString());
    }
  }, [created, router]);

  const { formState } = state;
  const [content, setContent] = useState(publicPost?.content || '');

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <InputText
          labelText="ID"
          name="id"
          placeholder="ID gerado automaticamente"
          type="text"
          defaultValue={formState.id}
          readOnly
          disabled={isPending}
        />

        <InputText
          labelText="Slug"
          name="slug"
          placeholder="Slug gerado automaticamente"
          type="text"
          defaultValue={formState.slug}
          readOnly
          disabled={isPending}
        />

        <InputText
          labelText="Título"
          name="title"
          placeholder="Digite o título"
          type="text"
          defaultValue={formState.title}
          disabled={isPending}
        />

        <InputText
          labelText="Excerto"
          name="excerpt"
          placeholder="Digite o resumo"
          type="text"
          defaultValue={formState.excerpt}
          disabled={isPending}
        />

        <MarkdownEditor
          labelText="Conteúdo"
          value={content}
          setValue={setContent}
          textAreaName="content"
          disabled={isPending}
        />

        <ImageUploader disabled={isPending} />

        <InputText
          labelText="Url da Imagem de Capa"
          name="coverImageUrl"
          placeholder="Digite a URL da imagem de capa"
          type="text"
          defaultValue={formState.coverImageUrl}
          disabled={isPending}
        />

        {mode === 'update' && (
          <InputCheckbox
            labelText="Publicar?"
            name="published"
            type="checkbox"
            defaultChecked={formState.published}
            disabled={isPending}
          />
        )}
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          Enviar
        </Button>
      </div>
    </form>
  );
}
