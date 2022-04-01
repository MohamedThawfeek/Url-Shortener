import React, { useEffect, useState } from "react";
import style from "./Home.module.css";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import axios from "../../components/axios/axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import io from "socket.io-client";

const socket = io("https://my-first-app-url-shortener.herokuapp.com");

const Home = () => {
  const [allData, setAllData] = useState([]);
  const [url, setUrl] = useState("");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const signout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  useEffect(() => {
    socket.connect();
    socket.on("new url", (urlDetails) =>
      setAllData((preData) => [...preData, urlDetails])
    );
    return () => {
      socket.disconnect();
    };
  }, [allData]);

  useEffect(() => {
    const result = async () => {
      const { data } = await axios.get("/api/shortUrl/all");
      setAllData(data.shortUrls);
    };
    result();
  }, [allData]);

  const add = async () => {
    const { data } = await axios.post("/api/shortUrl/add", {
      fullUrl: url,
    });
    console.log(data);
    setUrl("");
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <img src={logo} alt="" />
        <div className={style.head_content}>
          <div className={style.name_content}>
            <h5>
              hello {user.firstName}
              {user.lastName}{" "}
            </h5>
          </div>
          <Button onClick={signout} className={style.Button}>
            signOut
          </Button>
        </div>
      </div>

      <div className={style.content}>
        <div className={style.inputArea}>
          <input
            type="url"
            placeholder="Paste your Url"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <Button className={style.submit} onClick={add}>
            shrink
          </Button>
        </div>
      </div>
      <div className={style.table}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Full url</TableCell>
                <TableCell align="left">Short url</TableCell>
                <TableCell align="center">Click count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData.map((data) => (
                <TableRow
                  key={data._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">
                    <a href={data.full} target="_blank" rel="noreferrer">
                      {" "}
                      {data.full}
                    </a>
                  </TableCell>
                  <TableCell align="left">
                    <a
                      href={`/shorturl/${data.short}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.short}
                    </a>
                  </TableCell>
                  <TableCell align="center">{data.click}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Home;
