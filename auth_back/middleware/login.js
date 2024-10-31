const bcrypt = require('bcrypt');
const saltRound = 10;

const sginupMiddleware =  async (req, res, next) =>{
  const {email, userName, password } = req.body;

  if(!email || !password || !userName ) {
    return res.status(400).json({ success : false, message: 'All field required'});
  }

  try{
    const hashedPassword = await bcrypt.hash(password, saltRound);

    req.body.hashedPassword = hashedPassword;

    next;
  }catch(error){
    console.error('Error on hashing', err);
    return res.status(500).json({ success: false, message: 'Sign up failed' });
  }
}

module.exports = sginupMiddleware;




const loginMiddleware =  async (req, res, next) =>{
  const {email, password } = req.body;

  if(!email || !password ) {
    return res.status(400).json({ success : false, message: 'All field required'});
  }

  const queryLogin = 'SELECT * FROM user WHERE email = ?';
  db.query(queryLogin, [email], (err,results) =>{
    if(err) {
      console.error('Error when receiveing user',err);
      return res.status (500).json({ success: false, message: 'Login Failed'})
    }
    if(results.length === 0){
      return res.status(400).json({ success: false, message: 'Unable to Log in'})
    }

    const user = results[0];
    const hashedPassword = user.password;

    bcrypt.compare(password, hashedPassword, (err, isMatch) =>{
      if(err){
        console.error('Error compairing passwords', err);
        return res.status(500).json({success:fail, message:'Login failed'})
      }
      if(!isMatch){
        return res.status(400).json({success:fail, message: 'Password or user incorrect'})
      }
      req.user = user;
      next();
    })

  })


}

module.exports = loginMiddleware;