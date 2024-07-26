import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let navigate = useNavigate();
  const handleClick = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="h-[50px] bg-black text-white flex items-center">
      <div className="w-full px-5 flex justify-between ">
        <img src={logo} alt="logo" className="w-10 rounded-lg" />
        <button onClick={handleClick}>
          <h1 className="transition-transform hover:scale-110">Logout</h1>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
