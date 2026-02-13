import { hashPassword } from '@/lib/login/manage-login';

async () => {
  const mypassword = '123456';
  const hashedPassword = await hashPassword(mypassword);
  console.log('Hashed Password:', { hashedPassword });
};
