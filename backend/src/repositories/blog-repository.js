const prisma = require('../prismaClient');
const CrudRepository = require('./crud-repository');

class BlogRepository extends CrudRepository {
    constructor() {
        super(prisma.blog);
    }

    async blogsByUserId(userId) {
        return await this.model.findMany({ where: { author_id: userId } });
    }
}

module.exports = BlogRepository;
