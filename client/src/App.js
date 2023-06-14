/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import "./App.css";
import Auth from "./componenets/Auth";
import { useSelector, useDispatch } from "react-redux";
import Home from "./componenets/Home";
import { addToken } from "./reducers/authReducers";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addToken());
  }, []);

  const token = useSelector((state) => state.user.token);
  return <div className="App">{token ? <Home /> : <Auth />}</div>;
}

export default App;
