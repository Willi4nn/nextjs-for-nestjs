import { findAllPostsFromApiAdmin } from '@/lib/post/queries/admin';
import Link from 'next/link';
import ErrorMessage from '../../ErrorMessage';
import DeletePostButton from '../DeletePostButton';

export default async function PostsListAdmin() {
  const postsRes = await findAllPostsFromApiAdmin();

  if (!postsRes.success) {
    console.log(postsRes.errors);

    return (
      <ErrorMessage
        contentTitle="Ei 😅"
        content="Tente fazer login novamente"
      />
    );
  }

  const posts = postsRes.data;
  if (posts.length <= 0) {
    return (
      <ErrorMessage contentTitle="Ei 😅" content="Bora criar algum post??" />
    );
  }

  return (
    <div className="mb-16">
      {posts.map((post) => {
        return (
          <div
            className={`flex items-center justify-between px-2 py-2 ${!post.published && 'gap-2 bg-slate-300 text-black'}`}
            key={post.id}
          >
            <Link href={`/admin/post/${post.id}`}>{post.title}</Link>

            {!post.published && (
              <span className="text-xs text-slate-600 italic">
                (Não publicado)
              </span>
            )}

            <DeletePostButton id={post.id} title={post.title} />
          </div>
        );
      })}
    </div>
  );
}
