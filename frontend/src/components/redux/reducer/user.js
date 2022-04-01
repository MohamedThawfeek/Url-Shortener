const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  user: userInfo,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        user: action.user,
      };

    default:
      return state;
  }
};

export default appReducer;
