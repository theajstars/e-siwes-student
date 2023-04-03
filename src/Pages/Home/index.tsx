import { useState, useEffect } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import { Endpoints } from "../../lib/Endpoints";
import { FetchData } from "../../lib/FetchData";
import {
  Student,
  StudentResponse,
  Supervisor,
  SupervisorResponse,
  ValidateAdminResponse,
} from "../../lib/ResponseTypes";
import Container from "../Container";
import Navbar from "../Navbar";
import Profile from "../Profile";
import Students from "../Students";
import Supervisors from "../Supervisors";

import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Notification from "../Notification";
import SingleSupervisor from "../SingleSupervisor";
import SingleStudent from "../SingleStudent";
export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const adminToken = Cookies.get("admin_token");
    if (!adminToken) {
      navigate("/login");
    } else {
      FetchData({
        type: "GET",
        route: Endpoints.ValidateAdminToken,
      }).then((res: ValidateAdminResponse) => {
        const { auth } = res.data;
        if (!auth) {
          navigate("/login");
        }
      });
    }
  }, []);
  return (
    <>
      <Navbar />
      <Container>
        <Routes>
          <Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="/supervisors" element={<Supervisors />} />
            <Route
              path="/supervisors/:supervisorID"
              element={<SingleSupervisor />}
            />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:studentID" element={<SingleStudent />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notification" element={<Notification />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
}
