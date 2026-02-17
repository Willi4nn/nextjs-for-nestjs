import { ApiPostRepository } from './api-post-repository';
import { PostRepository } from './post-repository';

export const postRepository: PostRepository = new ApiPostRepository();
