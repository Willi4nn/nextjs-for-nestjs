import { CreateUserForm } from '@/components/CreateUserForm';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Criar Sua Conta',
};

export default function NewUserPage() {
  return <CreateUserForm />;
}
