import { findAllPublicPostsFromApiCached } from '../../lib/post/queries/public';
import ErrorMessage from '../ErrorMessage';
import PostCoverImage from '../PostCoverImage';
import PostSummary from '../PostSummary';

export default async function PostFeatured() {
  const postsRes = await findAllPublicPostsFromApiCached();
  const noPostsFound = (
    <ErrorMessage
      contentTitle="Ops 😅"
      content="Ainda não criamos nenhum post."
    />
  );

  if (!postsRes.success) {
    return noPostsFound;
  }

  const posts = postsRes.data;

  if (posts.length <= 0) {
    return noPostsFound;
  }

  const post = posts[0];
  const postLink = `/post/${post.slug}`;

  return (
    <section className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
      <PostCoverImage
        src={post.coverImageUrl}
        alt={post.title}
        href={postLink}
      />
      <PostSummary
        postHeading="h1"
        postLink={postLink}
        createdAt={post.createdAt}
        title={post.title}
        excerpt={post.excerpt}
      />
    </section>
  );
}
