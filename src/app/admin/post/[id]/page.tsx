import MenagePostForm from '@/components/admin/MenagePostForm';
import { findPostByIdFromApiAdmin } from '@/lib/post/queries/admin';
import { PublicPostForApiSchema } from '@/lib/post/schemas';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editar Post',
};

type AdminPostIdProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPostId({ params }: AdminPostIdProps) {
  const { id } = await params;
  const postRes = await findPostByIdFromApiAdmin(id);

  if (!postRes.success) {
    console.log(postRes.errors);
    notFound();
  }

  const post = postRes.data;
  const publicPost = PublicPostForApiSchema.parse(post);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-x1 font-extrabold">Editar Post</h1>
      <MenagePostForm mode="update" publicPost={publicPost} />
    </div>
  );
}
