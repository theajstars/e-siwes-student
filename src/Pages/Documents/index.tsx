import { Stack, Card, CardBody, Text, Button, Heading } from "@chakra-ui/react";
import ScafForm from "../../Assets/Documents/scaf_form.pdf";
import Form8 from "../../Assets/Documents/form_8.pdf";
import FormA from "../../Assets/Documents/form_a.pdf";
export default function Documents() {
  console.log(ScafForm);

  const downloadDoc = (doc: "scaf" | "form8" | "FormA") => {
    const a = document.createElement("a");
    a.href = doc === "scaf" ? ScafForm : doc === "form8" ? Form8 : FormA;
    a.click();
  };
  return (
    <>
      <br />
      <br />
      <Stack direction="row" spacing={10}>
        <Card
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          variant="outline"
          minWidth={"350px"}
        >
          <Stack>
            <CardBody>
              <Stack direction="column" spacing={5}>
                <Heading size="md">Form 8</Heading>
                <Text>Download Form 8</Text>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  width={200}
                  onClick={() => downloadDoc("form8")}
                >
                  Download Now
                </Button>
              </Stack>
            </CardBody>
          </Stack>
        </Card>
        <Card
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          variant="outline"
          minWidth={"350px"}
        >
          <Stack>
            <CardBody>
              <Stack direction="column" spacing={5}>
                <Heading size="md">SCAF Form</Heading>

                <Text>Download SCAF Form</Text>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  width={200}
                  onClick={() => {
                    downloadDoc("scaf");
                  }}
                >
                  Download Now
                </Button>
              </Stack>
            </CardBody>
          </Stack>
        </Card>
      </Stack>
      <br />
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        minWidth={"350px"}
      >
        <Stack>
          <CardBody>
            <Stack direction="column" spacing={5}>
              <Heading size="md">Form A</Heading>
              <Text>Download Form A</Text>
              <Button
                variant="solid"
                colorScheme="blue"
                width={200}
                onClick={() => downloadDoc("FormA")}
              >
                Download Now
              </Button>
            </Stack>
          </CardBody>
        </Stack>
      </Card>
    </>
  );
}
