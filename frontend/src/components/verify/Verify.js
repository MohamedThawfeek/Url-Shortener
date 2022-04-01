import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import style from "./Verify.module.css";

const Verify = () => {
  const { id } = useParams();
  const [verify, setVerify] = useState("verifying...");

  const navigate = useNavigate();

  const redirect = () => {
    navigate("/login");
  };

  useEffect(() => {
    const result = async () => {
      const { data } = await axios.get("/api/user/verification", {
        headers: {
          authorization: id,
        },
      });
      setVerify(data.msg);
    };
    result();
  }, [id]);
  return (
    <div className={style.container}>
      <h1>{verify}</h1>
      <Button onClick={redirect}>Go to Login Page</Button>
    </div>
  );
};

export default Verify;
