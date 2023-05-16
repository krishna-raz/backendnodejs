require('dotenv').config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

// require("../public/script/index")






const port = process.env.PORT || 5000;
const app = express();

//student data model connect
const Bcestudent = require("./model/register");


//to conver into json by express

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


//this code for conntect by public html code
const static_pah = path.join(__dirname, "../public")
app.use(express.static(static_pah));

//this code is used hbs 
const viewpath = path.join(__dirname, "../templates/views");
const partialspath = path.join(__dirname, "../templates/partials");
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialspath);



require("./db/con");
app.get("/", (req, res) => {
    res.render("index");

});

app.get("/profile", auth, async (req, res) => {

    try {
        //  const myname = await Bcestudent.findOne({ _id});
        res.status(201).render("profile");
        console.log("my user name");
    } catch (error) {
        res.status(400).send(error);
    }


});

app.get("/api/:id", async (req, res) => {
    try {
        // const _id = req.params.id;
        const _id = req.params.id;
        const studentid = await Bcestudent.find({ _id });
        res.send(studentid);

    }

    catch (e) {

        res.status(500).send("error");
    }
});

// app.post("/profile", async (req, res) => {
//     try {
//         const myemail = req.body.firstname;
//         console.log(myemail);
//     } catch (error) {
//         res.status(401).send(error);
//     }
// });


app.get("/index", (req, res) => {
    res.render("index");
    const token = req.cookies.krishna;
    console.log('my user token ', token);
});
app.get("/loging", (req, res) => {
    res.render("loging");
});
app.get("/logout", auth, async (req, res) => {
    try {

        //logout from single device
        // req.user.tokens = req.user.tokens.filter((currentelement) => {
        //     return currentelement.token !== req.token;
        // })

        //logout from all device
        req.user.tokens = [];

        res.clearCookie("krishna");
        console.log("logout successfull");
        await req.user.save();
        res.render("loging");
    } catch (error) {
        res.status(500).send(error);

    }
});
app.get("/register", (req, res) => {

    res.render("register");
});
app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpasswords = req.body.cpassword;



        if (password === cpasswords) {

            const newStudent = new Bcestudent({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                password: req.body.password,
                cpassword: req.body.cpassword,

            })

            const token = await newStudent.generateAuthToken();
            console.log("token=", token);

            res.cookie('krishna', token, { expires: new Date(Date.now() + 90000), httpOnly: true });

            const savestudent = await newStudent.save();
            res.status(201).render("index");
            console.log(savestudent);
        } else {
            res.send("password is not match")
        }
    } catch (e) {



        res.status(400).send("errer");
        console.log("errer3", e)
    }


});

//


//bcryptjs

const bcrypt = require("bcryptjs");
const { log } = require('console');


const bcryptconvert = async (password) => {
    const bcryptpassword = await bcrypt.hash(password, 1);


    console.log(bcryptpassword);

}

// bcryptconvert("krishna123");


//loging page 

app.post("/loging", async (req, res) => {
    try {
        const myemail = req.body.email;
        const password = req.body.password;


        const login = await Bcestudent.findOne({ email: myemail });
        const hashpass = await bcrypt.compare(password, login.password);

        const token = await login.generateAuthToken();
        console.log("token=", token);

        res.cookie('krishna', token, {
            expires: new Date(Date.now() + 90000),
            httpOnly: true
        });



        console.log("email=", myemail, "pass=", password);
        if (hashpass) {
            console.log("loging successfull");


            return res.status(201).render("profile");


        }
        else {
            console.log("loging faild");

        }


        return res.render("loging");
    } catch (error) {
        res.status(400).send("invaild loging detailt")
        console.log("loging faild");

    }
});


// Authentication & Cookies

const createtoken = async () => {

    const token = await jwt.sign({ _id: "60b9b0b0b0b0b0b0b0b0b0b0" }, "hellokrishnaiamarobbotandaitosolveyourproblenbyusing",);
    console.log(token);

}

// createtoken();



app.listen(port, () => {
    console.log("server is start")
})
