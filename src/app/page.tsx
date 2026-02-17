import PostFeatured from '@/components/PostFeatured';
import { PostsList } from '@/components/PostsList';
import { PostFeaturedSkeleton } from '@/components/Skeleton/PostFeaturedSkeleton';
import { PostsListSkeleton } from '@/components/Skeleton/PostsListSkeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <>
      <Suspense fallback={<PostFeaturedSkeleton />}>
        <PostFeatured />
      </Suspense>
      <Suspense fallback={<PostsListSkeleton />}>
        <PostsList />
      </Suspense>
    </>
  );
}
