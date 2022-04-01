import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import style from "./ResetPass.module.css";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const ResetPass = () => {
  const { token } = useParams();
  const [password, setPassword] = useState();
  const [visible, setVisible] = useState(false);
  const [eye, setEye] = useState(false);
  console.log(token);
  const on = () => {
    setEye(true);
    setVisible(true);
  };
  const off = () => {
    setEye(false);
    setVisible(false);
  };

  const navigate = useNavigate();

  const result = async () => {
    if (token === null) {
      return;
    }
    const { data } = await axios.post(`/api/user/forgetPass/${token}`, {
      password: password,
    });
    console.log(data);
    alert(data.msg);
    navigate("/login");
  };

  return (
    <div className={style.container}>
      <h3>reset your password</h3>

      <div className={style.input}>
        <input
          type={visible ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Enter your new  password"
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
      <button className={style.button} onClick={result}>
        Submit
      </button>
    </div>
  );
};

export default ResetPass;
