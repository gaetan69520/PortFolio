const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	try {
		console.log('auto',req.headers.authorization);
		const token = req.headers.authorization.split(' ')[1]
		console.log('1');
		const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
		console.log('2');
		const userId = decodedToken.userId
		console.log('3');
		req.auth = { userId }
		if (req.body.userId && req.body.userId !== userId) {
			throw 'Invalid user ID'
		} else {
			next()
		}
	} catch {
		res.status(401).json({
			error: new Error('You are not authenticated')
		})
	}
}
