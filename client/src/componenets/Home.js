import React from "react";
import { logout } from "../reducers/authReducers";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const { firstName } = useSelector((state) => state.user);

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, {firstName}!</p>
      <button className="" onClick={() => dispatch(logout())}>
        Logout
      </button>
    </div>
  );
}
