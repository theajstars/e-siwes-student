import { useState, useEffect } from "react";

import { Routes, Route, useNavigate, Link } from "react-router-dom";

import Cookies from "js-cookie";
import { Endpoints } from "../../lib/Endpoints";
import { FetchData } from "../../lib/FetchData";
import {
  Student,
  StudentResponse,
  Supervisor,
  SupervisorResponse,
  SingleStudentResponse,
} from "../../lib/ResponseTypes";
import ProfileLinkIcon from "../../Assets/IMG/ProfileLinkIcon.png";
import MyPaymentsLinkIcon from "../../Assets/IMG/MyPaymentsLinkIcon.png";
import DocumentLinkIcon from "../../Assets/IMG/DocumentLinkIcon.png";

import { Text, Button, Stack } from "@chakra-ui/react";
import MegaLoader from "../MegaLoader";
export default function Dashboard() {
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState<Student>();
  useEffect(() => {
    // Get Student Profile
    FetchData({
      type: "GET",
      route: Endpoints.GetSingleStudent.concat("currentIsStudent"),
    }).then((response: SingleStudentResponse) => {
      console.log(response);
      if (response.data.auth) {
        setStudentProfile(response.data.data);
      } else {
        Cookies.remove("student_token");
        window.location.href = "/login";
      }
    });
  }, []);
  return (
    <>
      <br />
      {studentProfile?.id ? (
        <Stack direction="column" spacing={20}>
          <div className=" flex-row dashboard-row">
            <div className="dashboard-link">
              <Stack
                direction="column"
                justifyContent="space-between"
                spacing={7}
              >
                <Stack direction="row" alignItems="center">
                  <img
                    src={ProfileLinkIcon}
                    alt=""
                    className="dashboard-link-image"
                  />
                  <Text color="linkedin.400" fontSize={18}>
                    Profile
                  </Text>
                </Stack>
                <Link to="/home/profile">
                  <Button colorScheme="whatsapp" width={"100%"}>
                    View Profile
                  </Button>
                </Link>
              </Stack>
            </div>
            <div className="dashboard-link">
              <Stack
                direction="column"
                justifyContent="space-between"
                spacing={7}
              >
                <Stack direction="row" alignItems="center">
                  <img
                    src={MyPaymentsLinkIcon}
                    alt=""
                    className="dashboard-link-image"
                  />
                  <Text color="linkedin.400" fontSize={18}>
                    My Payments
                  </Text>
                </Stack>
                <Link to="/home/profile">
                  <Button colorScheme="whatsapp" width={"100%"}>
                    Payments
                  </Button>
                </Link>
              </Stack>
            </div>
          </div>
          <div className=" flex-row dashboard-row">
            <div className="dashboard-link">
              <Stack
                direction="column"
                justifyContent="space-between"
                spacing={7}
              >
                <Stack direction="row" alignItems="center">
                  <img
                    src={DocumentLinkIcon}
                    alt=""
                    className="dashboard-link-image"
                  />
                  <Text color="linkedin.400" fontSize={18}>
                    Documents
                  </Text>
                </Stack>
                <Link to="/home/profile">
                  <Button colorScheme="whatsapp" width={"100%"}>
                    View Documents
                  </Button>
                </Link>
              </Stack>
            </div>
            <div className="dashboard-link">
              <Stack
                direction="column"
                justifyContent="space-between"
                spacing={7}
              >
                <Stack direction="row" alignItems="center">
                  <img
                    src={MyPaymentsLinkIcon}
                    alt=""
                    className="dashboard-link-image"
                  />
                  <Text color="linkedin.400" fontSize={18}>
                    My Payments
                  </Text>
                </Stack>
                <Link to="/home/profile">
                  <Button colorScheme="whatsapp" width={"100%"}>
                    View Profile
                  </Button>
                </Link>
              </Stack>
            </div>
          </div>
        </Stack>
      ) : (
        <MegaLoader />
      )}
      <br />
    </>
  );
}
