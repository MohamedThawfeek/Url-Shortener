import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import appReducer from "./components/redux/reducer/user";
import ReduxThunk from "redux-thunk";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Verify from "./components/verify/Verify";
import Forget from "./pages/forget/Forget";
import ResetPass from "./components/resetpass/ResetPass";
import Shorturl from "./components/short url/Shorturl";

const App = () => {
  const store = createStore(appReducer, applyMiddleware(ReduxThunk));

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify/:id" element={<Verify />} />
          <Route path="/forget/password" element={<Forget />} />
          <Route path="/forget/:token" element={<ResetPass />} />
          <Route path="/shorturl/:url" element={<Shorturl />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
