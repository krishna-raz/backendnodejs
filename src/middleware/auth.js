const jwt = require("jsonwebtoken");
const Student = require("../model/register");


const auth = async (req, res, next) => {
    try {
        // console.log("hello my middleware");
        const token = req.cookies.krishna;
        // console.log(token);
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

        const user = await Student.findOne({ _id: verifyUser._id });
        
      
        // console.log(user.firstname);
        req.token = token;
        req.user = user;
        
        next();

    } catch (e) {
        res.status(401).send(e);
        console.log("the error part");
    }
}
module.exports = auth;
