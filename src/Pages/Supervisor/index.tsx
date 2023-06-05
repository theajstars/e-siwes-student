import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Stack,
  StackDivider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Input,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  Student,
  Supervisor as SupervisorType,
  SingleSupervisorResponse,
  SingleStudentResponse,
  DefaultResponse,
} from "../../lib/ResponseTypes";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";

interface MessageProp {
  comment: string;
  student: string;
  supervisor: string;
  studentName: string;
  supervisorName: string;
  sender: "supervisor" | "student";
}
export default function Supervisor() {
  const addToast = useToast();

  const [student, setStudent] = useState<Student>();
  const [supervisor, setSupervisor] = useState<SupervisorType>();

  const fetchStudentAndSupervisor = async () => {
    const r1: SingleStudentResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetSingleStudent.concat("currentIsStudent"),
    });
    console.log(r1);
    const r2: SingleSupervisorResponse = await FetchData({
      route: Endpoints.GetStudentSupervisor,
      type: "GET",
    });
    console.log(r2);
    if (r2.data.auth) {
      setSupervisor(r2.data.data);
      const r: DefaultResponse = await FetchData({
        route: Endpoints.GetSupervisorMessages,
        type: "POST",
        data: { supervisorID: r2.data.data?.id },
      });
      console.log(r.data);
      setMessages(r.data.data ?? []);
    }
  };
  const [messages, setMessages] = useState<MessageProp[]>([]);

  const [message, setMessage] = useState<string>("");

  const fetchComments = async () => {
    const r: DefaultResponse = await FetchData({
      route: Endpoints.GetSupervisorMessages,
      type: "POST",
      data: { supervisorID: supervisor?.id },
    });
    console.log(r.data);
    setMessages(r.data.data ?? []);
  };
  useEffect(() => {
    fetchStudentAndSupervisor();
  }, []);
  const SendMessage = async () => {
    if (message.length === 0) {
      addToast({ description: "Please enter a message", status: "error" });
    } else {
      const r: DefaultResponse = await FetchData({
        route: Endpoints.SendSupervisorMessage,
        type: "POST",
        data: {
          comment: message,
          supervisorID: supervisor?.id,
        },
      }).catch(() => {
        addToast({ description: "An error occured", status: "error" });
      });
      setMessage("");
      fetchComments();
      console.log(r);
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">Supervisor Profile</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Name
              </Heading>
              <Text pt="2" fontSize="sm">
                {supervisor?.title} {supervisor?.firstName}{" "}
                {supervisor?.lastName}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
      <br />
      <Divider width="100%" />
      <br />
      <Heading size="md">Messages</Heading>
      {messages.length === 0 ? (
        <center>
          <Alert status="info" width={"80%"} my="20px">
            <AlertIcon />
            <AlertTitle>No Messages!</AlertTitle>
            <AlertDescription>There are no messages found.</AlertDescription>
          </Alert>
        </center>
      ) : (
        <Card>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              {messages.map((message, index) => {
                return (
                  <Box key={index}>
                    <Heading size="xs" textTransform="capitalize">
                      {message.sender === "student"
                        ? `${message.studentName}`
                        : `${message.supervisorName}`}
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {message.comment}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          </CardBody>
        </Card>
      )}
      <br />
      <Stack direction="row" justifyContent="space-between">
        <Input
          width={"80%"}
          placeholder="Leave message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Button colorScheme="linkedin" width="17%" onClick={SendMessage}>
          Send
        </Button>
      </Stack>
    </>
  );
}
