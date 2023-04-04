import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
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
  DefaultResponse,
  SingleStudentResponse,
  Student,
  ValidatePasswordResponse,
} from "../../lib/ResponseTypes";
import { Link } from "react-router-dom";

import Cookies from "js-cookie";
export default function Profile() {
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState<Student>();

  const getStudentProfile = async () => {
    const studentResponse: SingleStudentResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetSingleStudent.concat("currentIsStudent"),
    });

    if (studentResponse.data.auth) {
      setStudentProfile(studentResponse.data.data);
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
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassowrd, setConfirmNewPassword] = useState<string>("");

  const [isEmailUpdating, setEmailUpdating] = useState<boolean>(false);
  const [isPasswordUpdating, setPasswordUpdating] = useState<boolean>(false);

  const ValidateStudentPassword = async (passwordToValidate: string) => {
    const validatePassword: ValidatePasswordResponse = await FetchData({
      type: "POST",
      route: Endpoints.ValidateStudentPassword,
      data: { password: passwordToValidate },
    });
    return validatePassword.data.auth;
  };
  const ChangePassword = async () => {
    if (currentPassword.length === 0) {
      addToast({
        description: "Please provide your current password",
        status: "warning",
      });
    } else if (newPassword.length < 7) {
      addToast({
        description: "Password must be at least 7 characters",
        status: "warning",
      });
    } else if (newPassword !== confirmNewPassowrd) {
      addToast({
        description: "Passwords do not match!",
        status: "warning",
      });
    }

    if (
      currentPassword.length > 0 &&
      newPassword.length > 7 &&
      newPassword === confirmNewPassowrd
    ) {
      setPasswordUpdating(true);
      const isPasswordValid = await ValidateStudentPassword(currentPassword);
      if (isPasswordValid) {
        const passwordUpdate: DefaultResponse = await FetchData({
          route: Endpoints.UpdateAdminPassword,
          type: "POST",
          data: { password: newPassword },
        });
        setPasswordUpdating(false);
        if (passwordUpdate.data.auth) {
          addToast({
            description: "Your password has been changed!",
            status: "success",
          });
        } else {
          addToast({
            description: "There was an error changing your password!",
            status: "error",
          });
        }
      } else {
        setPasswordUpdating(false);
        addToast({
          description: "Password is not correct!",
          status: "error",
        });
      }
    }
  };

  const ChangeEmail = async () => {
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      addToast({
        title: "Please enter a valid email!",
        status: "warning",
      });
    } else {
      if (email !== confirmEmail) {
        addToast({
          title: "Emails do not match!",
          status: "error",
        });
      }
    }
    if (isEmailValid && email === confirmEmail) {
      // Change student email
      setEmailUpdating(true);
      const isPasswordValid = await ValidateStudentPassword(password);
      if (isPasswordValid) {
        const emailUpdate: DefaultResponse = await FetchData({
          route: Endpoints.UpdateAdminEmail,
          type: "POST",
          data: { newEmail: email },
        }).catch(() => {
          addToast({
            description: "Some error occurred!",
            status: "error",
          });
          setEmailUpdating(false);
        });
        setEmailUpdating(false);
        if (emailUpdate.data.auth) {
          // Email has been changed
          addToast({
            description: "Your email has been changed!",
            status: "success",
          });
        } else {
          addToast({
            description: "Some error occurred!",
            status: "error",
          });
        }
      } else {
        addToast({
          title: "Password is not correct!",
          status: "error",
        });
      }
    }
  };
  return (
    <>
      <br />
      <br />
      <Alert status="warning">
        <AlertIcon />
        You must complete your basic profile to gain access to the platform
      </Alert>
      <br />
      <Text size={"24px"}>Update Email</Text>
      <Stack spacing={45} direction="column">
        <Stack spacing={5} direction="column">
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="New Email"
            spellCheck={false}
          />
          <Input
            type="text"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="Confirm Email"
            spellCheck={false}
          />
          <Input
            type="password"
            placeholder="Input password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            disabled={isEmailUpdating}
            opacity={isEmailUpdating ? 0.5 : 1}
            colorScheme={"linkedin"}
            onClick={ChangeEmail}
          >
            Change Email &nbsp;{" "}
            {isEmailUpdating && <i className="far fa-spinner-third fa-spin" />}
          </Button>
        </Stack>
        <Stack spacing={5} direction="column">
          <Stack spacing={5} direction="row" alignItems="center">
            <Text size={"24px"}>Update Password</Text>
            <a target="_blank" href="/reset">
              <Text color="linkedin.400">
                Reset Password <i className="far fa-external-link-alt" />
              </Text>
            </a>
          </Stack>

          <Input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={confirmNewPassowrd}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <Button
            colorScheme={"linkedin"}
            disabled={isPasswordUpdating}
            opacity={isPasswordUpdating ? 0.5 : 1}
            onClick={ChangePassword}
          >
            Change Password &nbsp;{" "}
            {isPasswordUpdating && (
              <i className="far fa-spinner-third fa-spin" />
            )}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
