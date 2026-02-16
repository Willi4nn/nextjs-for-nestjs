import PostCoverImage from '@/components/PostCoverImage';
import PostSummary from '@/components/PostSummary';
import { findAllPublicPostsFromApiCached } from '@/lib/post/queries/public';

export async function PostsList() {
  const postsRes = await findAllPublicPostsFromApiCached();

  if (!postsRes.success) {
    return null;
  }

  const posts = postsRes.data;

  if (posts.length <= 1) {
    return null;
  }

  return (
    <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.slice(1).map((post) => {
        const postLink = `/post/${post.slug}`;

        return (
          <div className="flex flex-col gap-4" key={post.id}>
            <PostCoverImage
              href={postLink}
              src={post.coverImageUrl}
              alt={post.title}
            />

            <PostSummary
              postHeading="h2"
              postLink={postLink}
              createdAt={post.createdAt}
              title={post.title}
              excerpt={post.excerpt}
            />
          </div>
        );
      })}
    </div>
  );
}
