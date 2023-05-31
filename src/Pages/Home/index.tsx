import { useState, useEffect } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import { Endpoints } from "../../lib/Endpoints";
import { FetchData } from "../../lib/FetchData";
import {
  DefaultResponse,
  ValidateStudentAuthResponse,
} from "../../lib/ResponseTypes";
import Container from "../Container";
import Navbar from "../Navbar";
import Profile from "../Profile";

import Dashboard from "../Dashboard";
import Cookies from "js-cookie";

import Payments from "../Payments";
import Documents from "../Documents";
import BlockModal from "../BlockModal";
import { Button, Input, Text, useToast } from "@chakra-ui/react";

export default function Home() {
  const navigate = useNavigate();
  const addToast = useToast();
  const [authenticateWithToken, showAuthenticateWithToken] =
    useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [studentToken, setStudentToken] = useState<string>("");
  useEffect(() => {
    const studentToken = Cookies.get("student_token");
    if (!studentToken) {
      navigate("/login");
    } else {
      FetchData({
        type: "GET",
        route: Endpoints.ValidateStudentAuth,
      }).then((res: ValidateStudentAuthResponse) => {
        console.log("Auth response: ", res);
        const { auth } = res.data;
        if (!auth) {
          navigate("/login");
        } else {
          if (!res.data.data.isAuthenticated) {
            showAuthenticateWithToken(true);
          }
        }
      });
    }
  }, []);

  const AuthenticateStudent = async () => {
    if (studentToken.length !== 16) {
      addToast({
        description: "Please enter a valid token!",
        status: "error",
      });
    } else {
      setIsAuthenticating(true);
      const r: DefaultResponse = await FetchData({
        type: "POST",
        route: Endpoints.ValidateStudentToken,
        data: { token: studentToken },
      }).catch(() => {
        setIsAuthenticating(false);
      });
      setIsAuthenticating(false);
      console.log(r);
      if (r.data.auth) {
        addToast({
          description: "Verified Successfully!",
          status: "success",
        });
        window.location.reload();
      } else {
        addToast({
          description: "Token is invalid!",
          status: "error",
        });
      }
    }
  };
  return (
    <>
      <Navbar />
      <Container>
        {authenticateWithToken && (
          <BlockModal>
            <div className="flex-column align-center token-auth-container">
              <Text fontSize={19}>Please enter your token to continue</Text>
              <Input
                value={studentToken}
                maxLength={16}
                textTransform="uppercase"
                onChange={(e) => {
                  setStudentToken(e.target.value);
                }}
                width="100%"
              />
              <Button
                colorScheme="blue"
                width="100%"
                onClick={AuthenticateStudent}
                isLoading={isAuthenticating}
              >
                Auhtenticate
              </Button>
            </div>
          </BlockModal>
        )}
        <Routes>
          <Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/documents" element={<Documents />} />
            {/* <Route path="/supervisors" element={<Supervisors />} />
            <Route
              path="/supervisors/:supervisorID"
              element={<SingleSupervisor />}
            />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:studentID" element={<SingleStudent />} />
            <Route path="/notification" element={<Notification />} /> */}
          </Route>
        </Routes>
      </Container>
    </>
  );
}
