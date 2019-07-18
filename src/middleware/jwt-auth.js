const AuthService =require('../authentication/auth-service')


function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') ||" "
  
  if (!authToken.startsWith('bearer ')){
    return res.status(401).json({error: 'Missing Bearer Token'})
  }
  const bearerToken = authToken.slice(7)
  try {
    AuthService.verifyJwt(bearerToken )
  } catch (error) {
    return res.status(401).json({error:"Unauthorized Request"})
  }
  next()
}

module.exports = {
  requireAuth
}