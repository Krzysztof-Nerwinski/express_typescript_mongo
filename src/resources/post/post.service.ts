import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';
import { FilterQuery, Query } from 'mongoose';
import { options } from 'joi';

class PostService {
    private post = PostModel;

    public async create(title: string, body: string): Promise<Post> {
        try {
            return await this.post.create({ title, body });
        } catch (e) {
            throw new Error('Unable to create post');
        }
    }

    public async get(id: string): Promise<Post | null> {
        try {
            return await this.post.findById(id);
        } catch (e) {
            throw new Error('Unable to get post');
        }
    }

    // todo: check monquery or other package alike to learn how to allow
    //  for more elaborate queries like gt gte like etc.
    public async getMany(filters: FilterQuery<Post>): Promise<Post[]> {
        console.log('filters', filters);
        try {
            return await this.post.find(filters).setOptions({
                sanitizeFilter: true,
                limit: 10,
            });
        } catch (e) {
            throw new Error('Unable to query posts');
        }
    }

    public async delete(id: string) {
        try {
            return await this.post.deleteOne({ _id: id });
        } catch (e) {
            throw new Error('Unable to get post');
        }
    }
}

export default PostService;
