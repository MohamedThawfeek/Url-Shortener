import React, { useState } from "react";
import style from "./Login.module.css";
import { useDispatch } from "react-redux";
import { handelUser } from "../../components/redux/action/user";
import axios from "../../components/axios/axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [eye, setEye] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const on = () => {
    setEye(true);
    setVisible(true);
  };
  const off = () => {
    setEye(false);
    setVisible(false);
  };

  const register = () => {
    navigate("/signup");
  };

  const login = async () => {
    if ((!email.trim(), !password.trim())) {
      alert("Please fill the details");
      return;
    }
    try {
      const { data } = await axios.post("/api/user/login", {
        email,
        password,
      });
      localStorage.setItem("Token", data.token);
      dispatch(handelUser(data.token));
      if (data.msg) {
        alert(data.msg);
      }
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1>Login</h1>

        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter your E-mail"
          name="email"
        />
        <div className={style.input}>
          <input
            type={visible ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
          />
          {!eye ? (
            <span onClick={on} className={style.eye}>
              <Visibility />
            </span>
          ) : (
            <span onClick={off} className={style.eye}>
              <VisibilityOff />
            </span>
          )}
        </div>

        <Link to="/forget/password" className={style.link}>
          Forget Password?
        </Link>

        <div className={style.button}>
          <Button onClick={login}>Sign-In</Button>
          <Button onClick={register}>Sign-Up</Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
