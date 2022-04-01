import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios/axios";

const Shorturl = () => {
  const [shortLink, setShortLink] = useState("");
  const { url } = useParams();

  useEffect(() => {
    const result = async () => {
      const { data } = await axios.get(`/api/shortUrl/${url}`);
      setShortLink(data.short);
    };
    result();
  }, [url]);

  useEffect(() => {
    if (shortLink) {
      window.location.replace(shortLink);
    }
  }, [shortLink]);

  return <div></div>;
};

export default Shorturl;
