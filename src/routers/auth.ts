import passport from "passport";
import { Router } from "express";
import { User } from "../models/userModel";
import { setUserToken } from "../utils/jwt";
import { hashPassword } from "../utils/hash-password";
import { asyncHandler } from "../utils/async-handler";
import { local } from "../passport/strategies/local";

const authRouter = Router();

//회원가입 요청 핸들러
authRouter.post(
  "/join",
  asyncHandler(async (req, res, next) => {
    const { email, name, password } = req.body;
    const pwHash = hashPassword(password);
    const exists = await User.findOne({
      email,
    });

    if (exists) {
      throw new Error("이미 가입된 메일입니다.");
    }

    await User.create({
      email,
      name,
      password: pwHash,
    });
    res.redirect("/");
  })
);


//로그인 요청 핸들러
authRouter.post(
  "/login",
  passport.authenticate(local, {
    session: false,
  }), asyncHandler(
  (req, res, next) => {
    setUserToken(res, req.user);
    res.redirect("/");
  })
);

//회원정보 수정 요청 핸들러
authRouter.put(
  '/myPage/:shortd', asyncHandler(async(req,res,next)=>{
    const shortId = req.params.shortId;
    const { country, name } = req.body;
    const user = await User.findOneAndUpdate({shortId}, {country, name});
    res.json(user);
  })
)

//회원탈퇴 요청 핸들러
authRouter.delete(
  '/myPage/:shortId', asyncHandler(async(req,res,next)=>{
    const shortId = req.params.shortId;
    const deletedUser = await User.findOneAndDelete({shortId});
    res.json(deletedUser);
  })
)

export { authRouter };
