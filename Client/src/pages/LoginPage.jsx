import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [Bio, setBio] = useState("");

  const {login}=useContext(AuthContext)



  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currState === "signup" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState==="signup"?'signup':'login',{fullName,email,password,Bio})
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
    >
      {/* left */}
       
        <img src={assets.logo1} alt="" className="w-[min(30vw,400px)]" />
      
    
      
      {/* right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-500"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => {
                setIsDataSubmitted(false);
              }}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>
        {currState === "signup" && !isDataSubmitted && (
          <input
          value={fullName}
            type="text"
            className="  bg-transparent  p-2 border border-gray-500 rounded-md 
            focus:outline-none"
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email address"
              className=" bg-transparent p-2 border border-gray-500
               rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className=" bg-transparent p-2 border border-gray-500
               rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </>
        )}
        {currState === "signup" && isDataSubmitted && (
          <textarea
            rows={4}
            className=" bg-transparent p-2 border border-gray-500
               rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short Bio..."
            required
            onChange={(e) => setBio(e.target.value)}
            value={Bio}
          ></textarea>
        )}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400
            to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "signup" ? "Create Account " : "Login Now"}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500  ">
          <input type="checkbox" />
          <p>Agree to the Terms and Conditions</p>
        </div>
        <div className="flex flex-col gap-2">
          {currState === "signup" ? (
            <p className="text-sm text-gray-600">
              {" "}
              Already have an account?
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account
              <span
                onClick={() => {
                  setCurrState("signup");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
