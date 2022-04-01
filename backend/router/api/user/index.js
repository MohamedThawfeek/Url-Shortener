const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../../model/user");
const nodemailer = require("nodemailer");
const { verify, authenticate } = require("../../../middleware");

router.get("/", (req, res) => {
  res.send("router working");
});

router.post("/signup", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    req.body.password = hash;
    req.body.loginType = 2;
    const user = new User(req.body);
    await user.save();
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    const transport = nodemailer.createTransport({
      service: process.env.PLATFORM,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let info = await transport.sendMail({
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Verification E-Mail",
      html: ` <div> 
    <p style="color: black; font-family: cursive; font-size:20px; letter-spacing: 1px; text-shadow: 2px 0 3px rgba(0, 0, 0, 0.6);"> welcome  <b style='font-family: monospace;'>${req.body.lastName}</b> Thank you  for choosing our platform and keep Growing with us.</p>
      <div> 
      <button style="padding:10px; outline:none; border:none;   border-radius: 12px;">
      <a style="color: black; font-size:16px;  text-decoration: none;" href="https://my-first-url-shortener.netlify.app/verify/${token}">Verify Email</a> </button>
      <p style="color: black; font-family:cursive; font-size:15px letter-spacing: 1px">Thanks For Regards </p>
      <p style="color: black; font-family: cursive; font-size:15px letter-spacing: 1px">Our Mini Team </p>
      </div>
     </div>`,
    });
    if (info) {
      res.json({
        msg: "Account has been created Successfully. Please verify your E-mail ",
      });
    }
  } catch (error) {
    res.json({
      msg: "This E-mail-Id has been created already in our website. So please change your E-mail-Id and try again",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ msg: "User not found" });
    }
    if (!user.verified) {
      return res.json({ msg: "Account not Verified" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const token = await jwt.sign(
        {
          userId: user._id,
        },
        process.env.SECRET_KEY
      );
      return res.json({ token });
    } else {
      return res.json({ msg: "Wrong Password" });
    }
  } catch (error) {
    res.json(error);
  }
});

router.get("/data", authenticate, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.userId }).select(
      "-createdAt -updatedAt -password -__v"
    );

    res.json({ success: true, user });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.get("/verification", verify, async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(
      { _id: req.userId },
      { verified: true }
    );
    if (data) {
      return res.json({ success: true, msg: "Account has been verified" });
    }
  } catch (error) {
    res.json({ success: false, msg: error });
  }
});

router.post("/forget", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.verified) {
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "2m",
        });
        const transporter = nodemailer.createTransport({
          service: process.env.PLATFORM,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
          },
        });
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: req.body.email,
          subject: "Reset your Password",
          html: `
                <div> 
                <p  style="color: black;  font-variant: small-caps; font-family: sans-serif; font-size:22px"> Hello <b>${user.lastName}</b> your password change request is successfully initiated.</p>
                <div> 
                <button style="padding:10px; outline:none;">
                <a style="color: black; text-decoration: none;" href="https://my-first-url-shortener.netlify.app/forget/${token}">Click here to reset-password</a>
                </button>
                <p style="color: black; font-family: sans-serif; font-size:15px">This link has been expire in 2 minutes</p>
                <p style="color: black; font-family: sans-serif; font-size:15px">For Mini Team </p>
               </div>
               </div>
                `,
        });

        res.json({ msg: " Verify your e-mail and reset your password" });
      } else {
        res.json({ msg: "Invalid Email-Id" });
      }
    } else {
      res.json({
        msg: "Your account is not verified! Please verify your account",
      });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

router.post("/forgetPass/:token", async (req, res) => {
  try {
    const token = req.params.token;

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.json({
          msg: "Token has been expired! Please Try again",
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt).then(async (hash) => {
            await User.findByIdAndUpdate(
              { _id: decoded.id },
              { password: hash },
              { new: true }
            );
            res.json({
              msg: "Password has been changed successfully please go to login!",
            });
          });
        });
      }
    });
  } catch (error) {
    return res.json({ msg: error.message });
  }
});

module.exports = router;
