const { verifyToken } = require('../utils/auth');
const { StatusCodes } = require('http-status-codes');
const { isRevoked: redisIsRevoked, connectRedis } = require('../utils/redisClient');

async function authMiddleware(req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Authorization header missing' });
		}

		// Expect format: "Bearer <token>" or the raw token
		const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

		// ensure redis connection is ready
		await connectRedis();
		const revoked = await redisIsRevoked(token);
		if (revoked) {
			return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token has been revoked' });
		}

		const decoded = verifyToken(token);
		// attach user info to request for downstream handlers
		req.user = decoded;
		next();
	} catch (error) {
		console.error('Auth middleware error', error);
		res.status(error.statusCode || StatusCodes.UNAUTHORIZED).json({ error: error.message || 'Unauthorized' });
	}
}

module.exports = {
	authMiddleware,
};
