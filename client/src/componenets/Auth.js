import React, { useState } from "react";
import { signupUser, signinUser } from "../reducers/authReducers";
import { useDispatch, useSelector } from "react-redux";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [auth, setAuth] = useState("signin");
  const dispatch = useDispatch();

  const { error, token } = useSelector((state) => state.user);

  const authenticate = () => {
    if (auth === "signin") {
      dispatch(signinUser({ email, password, firstName }));
      console.log("token", token);
    } else {
      dispatch(signupUser({ email, password, firstName }));
    }
  };

  return (
    <div>
      <h1>please {auth}!</h1>
      <br></br>
      <br></br>
      {error && <h5>{error}</h5>}
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br></br>
      <br></br>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br></br>
      <br></br>
      {auth === "signup" ? (
        <input
          type="firstName"
          placeholder="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      ) : null}
      <br></br>
      <br></br>

      {auth === "signin" ? (
        <h6 onClick={() => setAuth("signup")}>Dont have an account ?</h6>
      ) : (
        <h6 onClick={() => setAuth("signin")}>Already have an account?</h6>
      )}
      <button className="" onClick={() => authenticate()}>
        {auth}
      </button>
    </div>
  );
}

export default Auth;
