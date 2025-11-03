const {Redis} = require('ioredis');

const BLOG_KEY = (id) => `blog:${id}`;
const ALL_BLOGS_KEY = 'blogs:all';
const CACHE_TTL = 3600; // 1 hour


class CachedBlogRepository {
    constructor(blogRepository, redisClient) {
        this.blogRepository = blogRepository;
        this.Redis = redisClient;
    }

    async findById(id) {
        const cacheKey = BLOG_KEY(id);
        try {
            const cachedBlog = await this.Redis.get(cacheKey);
            if (cachedBlog) {
                console.log(`Cache hit for blog ID ${id}`);
                return JSON.parse(cachedBlog);
            }
        } catch (error) {
            console.error(`Error fetching blog ID ${id} from cache:`, error);
        }
        console.log(`Cache miss for blog ID ${id}`);
        const blog = await this.blogRepository.findById(id);
        if (blog) {
            await this.Redis.set(cacheKey, JSON.stringify(blog), 'EX', CACHE_TTL);
        }
        return blog;
    }

    async findAll() {
        const cachedKeys = ALL_BLOGS_KEY;
        try{
            const cachedBlogs = await this.Redis.get(cachedKeys);
            if (cachedBlogs) {
                console.log('Cache hit for all blogs');
                return JSON.parse(cachedBlogs);
            }
        } catch (error) {
            console.error('Error fetching all blogs from cache:', error);
        }
        console.log('Cache miss for all blogs');
        const blogs = await this.blogRepository.findAll();
        if(blogs && blogs.length > 0){
            await this.Redis.set(cachedKeys, JSON.stringify(blogs), 'EX', CACHE_TTL);
        }
        return blogs;
    }

    async create(blogData) {
        const newBlog = await this.blogRepository.create(blogData);
        // Invalidate the all blogs cache
        await this.Redis.del(ALL_BLOGS_KEY);
        return newBlog;
    }


    async update(blogData) {
        const updatedBlog =  await this.blogRepository.update(blogData);
        // Invalidate the specific blog cache
        await this.Redis.del(BLOG_KEY(updatedBlog.id));
        // Invalidate the all blogs cache
        await this.Redis.del(ALL_BLOGS_KEY);
        return updatedBlog;
    }

    async delete(id) {
        const result = await this.blogRepository.delete(id);
        // Invalidate the specific blog cache
        await this.Redis.del(BLOG_KEY(id));
        // Invalidate the all blogs cache
        await this.Redis.del(ALL_BLOGS_KEY);
        return result;
    }
}

module.exports = CachedBlogRepository;
