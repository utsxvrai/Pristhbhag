const prisma = require('../prismaClient');
const CrudRepository = require('./crud-repository');

class UserRepository extends CrudRepository {
    constructor() {
        super(prisma.user);
    }

    async findByEmail(email) {
        return await this.model.findUnique({ where: { email } });
    }
}


module.exports = UserRepository;