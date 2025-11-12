const {UserService} = require('../services');
const {StatusCodes} = require('http-status-codes');
const { revokeToken } = require('../utils/redisClient');



async function createUser(req, res) {
    try {
        const user = await UserService.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
        );
        res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
        console.error('Error in createUser controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}
async function getUserById(req, res) {
    try {
        const user = await UserService.getById(parseInt(req.params.id));
        res.status(StatusCodes.OK).json(user);
    }
    catch (error) {
        console.error('Error in getUserById controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function signIn(req, res) {
    try {
        const { email, password } = req.body;
        const result = await UserService.signIn({ 
            "email": email, 
            "password": password
        });
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in signIn controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function signOut(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Authorization header missing' });
        }
        await revokeToken(authHeader);
        res.status(StatusCodes.OK).json({ message: 'Signed out successfully' });
    } catch (error) {
        console.error('Error in signOut controller:', error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}



module.exports = {
    createUser,
    getUserById,
    signIn,
    signOut,

};