import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { Login } from "./Pages/Login";
import Home from "./Pages/Home";
import Supervisors from "./Pages/Supervisors";
import Students from "./Pages/Students";
import Profile from "./Pages/Profile";
import Cookies from "js-cookie";
import Notification from "./Pages/Notification";
import SingleSupervisor from "./Pages/SingleSupervisor";
import SingleStudent from "./Pages/SingleStudent";
import Reset from "./Pages/Reset";
import { Register } from "./Pages/Register";
import Payments from "./Pages/Payments";

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
type PaystackConfigProps = {
  email: string;
  amount: number;
};
const getPayStackConfig = ({ email, amount }: PaystackConfigProps) => {
  const PaystackConfig = {
    reference: new Date().getTime().toString(),
    email,
    amount,
    publicKey: "pk_live_22766e7d447ea8ee065eb8dcc2a7c81767caec1a",
  };
  return PaystackConfig;
};

const getFullDate = (dateString: number) => {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const d = new Date(dateString);

  const date = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${month} ${date}, ${year}`;
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/home" element={<Home />}>
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/payments" element={<Payments />} />
          {/* <Route path="/home/supervisors" element={<Supervisors />} />
          <Route
            path="/home/supervisors/:supervisorID"
            element={<SingleSupervisor />}
          />
          <Route path="/home/students" element={<Students />} />
          <Route path="/home/students/:studentID" element={<SingleStudent />} />
          <Route path="/home/notification" element={<Notification />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export { validateEmail, getPayStackConfig, getFullDate };
export default App;
