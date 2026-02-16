'use client';

import { updatePasswordAction } from '@/actions/user/update-user-password-action';
import { Button } from '@/components/Button';
import InputText from '@/components/InputText';
import clsx from 'clsx';
import { LockKeyholeIcon } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function UpdatePasswordForm() {
  const [state, action, isPending] = useActionState(updatePasswordAction, {
    errors: [],
    success: false,
  });

  useEffect(() => {
    toast.dismiss();

    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error));
    }

    if (state.success) {
      toast.success('Atualizado com sucesso');
    }
  }, [state]);

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        'mx-auto mt-16 mb-32 max-w-sm text-center'
      )}
    >
      <form action={action} className="flex flex-1 flex-col gap-6">
        <InputText
          type="password"
          name="currentPassword"
          labelText="Senha antiga"
          placeholder="Sua senha antiga"
          disabled={isPending}
          defaultValue={''}
        />

        <InputText
          type="password"
          name="newPassword"
          labelText="Senha nova"
          placeholder="Sua nova senha"
          disabled={isPending}
          defaultValue={''}
        />

        <InputText
          type="password"
          name="newPassword2"
          labelText="Repetir senha nova"
          placeholder="Sua nova senha novamente"
          disabled={isPending}
          defaultValue={''}
        />

        <div className="mt-4 flex items-center justify-center">
          <Button size="md" disabled={isPending} type="submit">
            <LockKeyholeIcon />
            Atualizar senha
          </Button>
        </div>
      </form>
    </div>
  );
}
