import React, { useState } from "react";
import style from "./Forget.module.css";
import axios from "../../components/axios/axios";

const Forget = () => {
  const [email, setEmail] = useState("");

  const forget = async () => {
    try {
      const { data } = await axios.post("/api/user/forget", {
        email,
      });
      alert(data.msg);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={style.container}>
      <h2>
        Submit Your email and send the request to get reset password link your
        email
      </h2>

      <input
        type="email"
        placeholder="please enter your email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        name="email"
      />
      <button onClick={forget}>send</button>
    </div>
  );
};

export default Forget;
