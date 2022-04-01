import axios from "../../axios/axios";

export const setUser = (user) => {
  return {
    type: "ADD_USER",
    user,
  };
};

export const handelUser = (token) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: {
          authorization: localStorage.getItem("Token"),
        },
      });
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      dispatch(setUser(data.user));
    } catch (error) {
      console.log(error);
    }
  };
};
