import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  StackDivider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { validateEmail } from "../../App";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";
import {
  Admin,
  AdminResponse,
  CourseProgrammes,
  CourseProgrammesSelect,
  DefaultResponse,
  SingleStudentResponse,
  Student,
  ValidatePasswordResponse,
} from "../../lib/ResponseTypes";
import { Link } from "react-router-dom";

import Cookies from "js-cookie";
export default function Profile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>();

  const [isBasicProfileUpdating, setBasicProfileUpdating] =
    useState<boolean>(false);

  const getStudentProfile = async () => {
    const studentResponse: SingleStudentResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetSingleStudent.concat("currentIsStudent"),
    });

    if (studentResponse.data.auth) {
      setStudent(studentResponse.data.data);
    } else {
      Cookies.remove("student_token");
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    // Get Student Profile
    getStudentProfile();
  }, []);
  const addToast = useToast();

  const ValidateStudentPassword = async (passwordToValidate: string) => {
    const validatePassword: ValidatePasswordResponse = await FetchData({
      type: "POST",
      route: Endpoints.ValidateStudentPassword,
      data: { password: passwordToValidate },
    });
    return validatePassword.data.auth;
  };

  const SubmitBasicProfile = async () => {
    if (student) {
      const { firstName, lastName, email, phone, courseOfStudy, level } =
        student;
      const isEmailValid = validateEmail(email);

      if (!firstName || !lastName || !phone || !courseOfStudy || !level) {
        addToast({
          description: "Please fill out the form!",
          status: "warning",
        });
      } else {
        if (!isEmailValid) {
          addToast({
            description: "Please provide a valid email!",
            status: "warning",
          });
        }
      }
      if (
        firstName &&
        lastName &&
        phone &&
        courseOfStudy &&
        level &&
        isEmailValid
      ) {
        // All is good, update profile
        setBasicProfileUpdating(true);
        const UpdateBasicProfile: DefaultResponse = await FetchData({
          route: Endpoints.UpdateBasicStudentProfile,
          type: "POST",
          data: {
            email,
            firstName,
            lastName,
            phone,
            courseOfStudy,
            level,
          },
        }).catch(() => {
          setBasicProfileUpdating(false);
          addToast({
            status: "error",
            description: "An error occured! Please try again",
          });
        });
        setBasicProfileUpdating(false);

        if (UpdateBasicProfile.data.auth) {
          addToast({
            status: "success",
            description: "Your profile has been updated",
          });
          getStudentProfile();
        } else {
          addToast({
            status: "error",
            description: "An error occured! Please try again",
          });
        }
      }
    }
  };

  return (
    <>
      <br />
      <br />
      {student?.id && (
        <>
          {!student.isProfileComplete && (
            <>
              <Alert status="warning">
                <AlertIcon />
                You must complete your basic profile to gain access to the
                platform
              </Alert>
              <br />
            </>
          )}
          <Stack direction="column" spacing={5}>
            <Text size={"25px"}>Basic Profile</Text>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Input
                placeholder="First Name"
                value={student.firstName}
                onChange={(e) =>
                  setStudent({ ...student, firstName: e.target.value })
                }
              />
              <Input
                placeholder="Last Name"
                value={student.lastName}
                onChange={(e) =>
                  setStudent({ ...student, lastName: e.target.value })
                }
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Input
                placeholder="Email Address"
                value={student.email}
                onChange={(e) => {
                  setStudent({ ...student, email: e.target.value });
                }}
              />
              <Input
                placeholder="Matric Number"
                disabled
                value={student.matricNumber}
              />
            </Stack>
            <InputGroup>
              <InputLeftAddon children="+234" />
              <Input
                variant="outline"
                placeholder="Phone"
                value={student.phone}
                onChange={(e) => {
                  setStudent({ ...student, phone: e.target.value });
                }}
                spellCheck={false}
              />
            </InputGroup>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Select
                placeholder="Current Level"
                value={student.level}
                onChange={(e) => {
                  setStudent({
                    ...student,
                    level: e.target.value,
                  });
                }}
              >
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
              </Select>
              <Select
                placeholder="Course of Study"
                value={student.courseOfStudy}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement> & {
                    target: { value: CourseProgrammes };
                  }
                ) => {
                  setStudent({
                    ...student,
                    courseOfStudy: e.target.value,
                  });
                }}
              >
                <option value="computer_science">Computer Science</option>
                <option value="cyber_security">Cyber Security</option>
                <option value="software_engineering">
                  Software Engineering
                </option>
                <option value="information_technology">
                  Information Technology
                </option>
              </Select>
            </Stack>
            <Button colorScheme="linkedin" onClick={SubmitBasicProfile}>
              Submit&nbsp;{" "}
              {isBasicProfileUpdating && (
                <i className="far fa-spinner-third fa-spin" />
              )}
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}
