import { PostModel } from '@/models/post/post-model';
import { apiRequest } from '@/utils/api-request';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { PostRepository } from './post-repository';

export class ApiPostRepository implements PostRepository {
  // Rotas Públicas
  async findAllPublic(): Promise<PostModel[]> {
    const res = await apiRequest<PostModel[]>('/post');
    if (!res.success) throw new Error(res.errors[0]);
    return res.data;
  }

  async findBySlugPublic(slug: string): Promise<PostModel> {
    const res = await apiRequest<PostModel>(`/post/${slug}`);
    if (!res.success) throw new Error(res.errors[0]);
    return res.data;
  }

  // Rotas Privadas (Admin)
  async findAll(): Promise<PostModel[]> {
    const res = await authenticatedApiRequest<PostModel[]>('/post/me');
    if (!res.success) throw new Error(res.errors[0]);
    return res.data;
  }

  async findById(id: string): Promise<PostModel> {
    const res = await authenticatedApiRequest<PostModel>(`/post/me/${id}`);
    if (!res.success) throw new Error(res.errors[0]);
    return res.data;
  }

  async create(post: PostModel): Promise<PostModel> {
    const res = await authenticatedApiRequest<PostModel>('/post/me', {
      method: 'POST',
      body: JSON.stringify(post),
    });
    if (!res.success) throw new Error(res.errors[0]);
    return res.data;
  }

  async delete(id: string): Promise<PostModel> {
    const res = await authenticatedApiRequest<PostModel>(`/post/me/${id}`, {
      method: 'DELETE',
    });
    if (!res.success) throw new Error(res.errors[0]);
    return res.data;
  }

  async update(id: string, data: any): Promise<PostModel> {
    const res = await authenticatedApiRequest<PostModel>(`/post/me/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.success) throw new Error(res.errors[0]);
    return res.data;
  }
}
