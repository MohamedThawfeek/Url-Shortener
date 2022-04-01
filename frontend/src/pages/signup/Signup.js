import React, { useState } from "react";
import style from "./Signup.module.css";
import { Button } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import axios from "../../components/axios/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userInput, setUserInput] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
  });

  const [visible, setVisible] = useState(false);
  const [eye, setEye] = useState(false);
  const navigate = useNavigate();

  const on = () => {
    setEye(true);
    setVisible(true);
  };
  const off = () => {
    setEye(false);
    setVisible(false);
  };

  const handelChange = (e) => {
    const { name, value } = e.target;

    setUserInput((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const sign_Up = async () => {
    if (
      !userInput.firstName ||
      !userInput.lastName ||
      !userInput.email ||
      !userInput.password
    ) {
      alert("Enter all the details");
      return;
    }

    try {
      const { data } = await axios.post("/api/user/signup", userInput);

      alert(data.msg);
    } catch (error) {
      alert(error.message);
    }
    setUserInput({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    navigate("/login");
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1>Sign up</h1>

        <input
          type="text"
          value={userInput.firstName}
          onChange={handelChange}
          placeholder="Enter your first name"
          name="firstName"
        />
        <input
          type="text"
          value={userInput.lastName}
          onChange={handelChange}
          placeholder="Enter your last name"
          name="lastName"
        />

        <input
          type="email"
          value={userInput.email}
          onChange={handelChange}
          placeholder="Enter your email"
          name="email"
        />

        <div className={style.input}>
          <input
            type={visible ? "text" : "password"}
            onChange={handelChange}
            value={userInput.password}
            placeholder="Enter your password"
            name="password"
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

        <Button className={style.signup} onClick={sign_Up}>
          create your urlShortener account
        </Button>
      </div>
    </div>
  );
};

export default Signup;
