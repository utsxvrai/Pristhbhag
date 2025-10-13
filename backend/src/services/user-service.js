const { UserRepository } = require('../repositories');
const { generateToken, checkPassword } = require('../utils/auth');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');


const userRepository = new UserRepository();

async function create(data){

    try{
        data.password = await bcrypt.hash(data.password, 10);
        const user = await userRepository.create(data);
        return user;
    }
    catch(error){
        console.error('Error creating user:', error);
        throw error;
    }
}

async function getById(id){
    try{
        const user = await userRepository.findById(id);
        if(!user){
            const error = new Error('User not found');
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        return user;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
}

async function signIn(data) {
    try {
        const user = await userRepository.findByEmail(data.email);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        const isPasswordValid = await checkPassword(data.password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }
        const token = generateToken(user);
        return { user, token };
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

async function isAuthenticated(token) {
    try {
        const decoded = verifyToken(token);
        const user = await userRepository.findById(decoded.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }  
        return user;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
}




module.exports = {
    create,
    getById,
    signIn,
    isAuthenticated
};
