import { useState } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  Text,
  Input,
  Button,
  useToast,
  Stack,
  InputGroup,
  InputLeftAddon,
  Select,
} from "@chakra-ui/react";
import Logo from "../../Assets/IMG/Logo.png";
import { AxiosResponse } from "axios";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";
import {
  Colleges,
  DefaultResponse,
  LoginResponse,
} from "../../lib/ResponseTypes";
import Cookies from "js-cookie";
import { validateEmail } from "../../App";

interface RegisterFormType {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  matricNumber: string;
  password: string;
  confirmPassword: string;
  college: Colleges;
}
export const Register = () => {
  const navigate = useNavigate();
  const addToast = useToast();
  const [isFormSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [Form, SetForm] = useState<RegisterFormType>({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    firstName: "",
    lastName: "",
    matricNumber: "",
    college: "COLNAS",
  });

  const RegisterStudent = async (e: any) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      matricNumber,
      phone,
      college,
    } = Form;
    const isEmailValid = validateEmail(email);
    if (
      isEmailValid &&
      lastName.length > 0 &&
      firstName.length > 0 &&
      password.length >= 7 &&
      password === confirmPassword &&
      matricNumber.length === 9 &&
      college.length > 0 &&
      phone.length === 10
    ) {
      setFormSubmitting(true);
      const response: DefaultResponse = await FetchData({
        route: Endpoints.StudentRegister,
        type: "POST",
        data: Form,
      }).catch(() => {
        addToast({
          status: "error",
          description: "An error occured! Please try again",
        });
      });
      setFormSubmitting(false);
      console.log(response);
      if (response.data.auth) {
        Cookies.set("student_token", response.data.data);
        window.location.href = "/home";
      } else {
        const STUDENT_ALREADY_EXISTS = "Student already exists".toLowerCase();

        if (response.data.message.toLowerCase() === STUDENT_ALREADY_EXISTS) {
          addToast({
            title: "Student already exists!",
            status: "error",
          });
        } else {
          addToast({
            title: "An error occurred while logging in",
            status: "error",
          });
        }
      }
    } else {
      if (!isEmailValid) {
        addToast({
          title: "Please enter a valid email",
          status: "error",
        });
      } else {
        if (firstName.length === 0 || lastName.length === 0) {
          addToast({
            title: "Please input your name",
            status: "error",
          });
        } else {
          if (matricNumber.length !== 9) {
            addToast({
              title: "Enter a valid matriculation number",
              status: "error",
            });
          } else {
            if (password.length < 7) {
              addToast({
                title: "Your password must be at least 7 characters",
                status: "warning",
              });
            } else {
              if (password !== confirmPassword) {
                addToast({
                  title: "Your passwords do not match",
                  status: "warning",
                });
              }
            }
          }
        }
      }
    }
  };
  return (
    <div className="auth-container flex-column">
      <img src={Logo} alt="" className="login-image" />
      <br />
      <form action="#" onSubmit={(e) => RegisterStudent(e)}>
        <div className="register-form flex-column">
          <Text fontSize="2xl">Register</Text>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={5}
            width="100%"
          >
            <Input
              variant="outline"
              value={Form.firstName}
              name="firstname"
              onChange={(e) => {
                SetForm({ ...Form, firstName: e.target.value });
              }}
              placeholder="First Name"
              spellCheck={false}
            />
            <Input
              variant="outline"
              value={Form.lastName}
              onChange={(e) => {
                SetForm({ ...Form, lastName: e.target.value });
              }}
              placeholder="Last Name"
              spellCheck={false}
            />
          </Stack>
          <Input
            variant="outline"
            value={Form.email}
            name="Email address"
            onChange={(e) => {
              SetForm({ ...Form, email: e.target.value });
            }}
            placeholder="Email"
            spellCheck={false}
          />
          <Stack direction="row" justifyContent="space-between" spacing={5}>
            <Input
              variant="outline"
              value={Form.matricNumber}
              name="Matric"
              maxLength={9}
              onChange={(e) => {
                SetForm({ ...Form, matricNumber: e.target.value });
              }}
              placeholder="Matric Number"
              spellCheck={false}
            />
            <InputGroup>
              <InputLeftAddon children="+234" />
              <Input
                variant="outline"
                value={Form.phone}
                maxLength={10}
                onChange={(e) => {
                  SetForm({ ...Form, phone: e.target.value });
                }}
                placeholder="Phone"
                spellCheck={false}
              />
            </InputGroup>
          </Stack>
          <Stack direction="row" width="100%" justifyContent="space-between">
            <Input
              variant="outline"
              value={Form.password}
              onChange={(e) => {
                SetForm({ ...Form, password: e.target.value });
              }}
              placeholder="Password"
              type={"password"}
            />
            <Input
              variant="outline"
              value={Form.confirmPassword}
              onChange={(e) => {
                SetForm({ ...Form, confirmPassword: e.target.value });
              }}
              placeholder="Confirm Password"
              type={"password"}
            />
          </Stack>
          <Select
            placeholder="Select option"
            value={Form.college}
            onChange={(e) => {
              SetForm({ ...Form, college: e.target.value as Colleges });
            }}
          >
            <option value="COSMAS">COSMAS</option>
            <option value="COLNAS">COLNAS</option>
            <option value="COLMED">COLMED</option>
          </Select>

          <Button
            type="submit"
            colorScheme="linkedin"
            width={"100%"}
            disabled={isFormSubmitting}
            opacity={isFormSubmitting ? 0.5 : 1}
          >
            Continue &nbsp;
            {isFormSubmitting && <i className="far fa-spinner-third fa-spin" />}
          </Button>
        </div>
      </form>
      <Stack direction="row" marginTop={4}>
        <Text>Already have an account?</Text>
        <Text color="linkedin.400">
          <Link to="/login">Login</Link>
        </Text>
      </Stack>
      <Stack direction="row" marginTop={4}>
        <Text>Forgot Password?</Text>
        <Text color="linkedin.400">
          <Link to="/reset">Reset</Link>
        </Text>
      </Stack>
    </div>
  );
};
