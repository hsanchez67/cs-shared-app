import React, { useState } from "react";
// import axios from "axios";
import { Box, Card, Grid, Spinner } from "theme-ui";
import { Heading, TextInput, Form, Button } from "@loanpal/lumos__core";
import { object, string } from "yup";
import logo from "../../images/goodleap-white-orange.svg";

// api
import { API } from "aws-amplify";

const buildPaydown = (values) => {
  const {
    referenceNumber,
    offerId,
    // groupId,
    state,
    email,
    firstName,
    lastName,
    salesRepEmail,
    salesRepFirstName,
    salesRepLastName,
    salesRepPhone,
    loanAmount,
    autopayIntent,
  } = values;

  return JSON.stringify({
    referenceNumber: referenceNumber !== "" ? referenceNumber : lastName,
    offerId: offerId,
    // channel: groupId,
    state: state,
    applicant: {
      email: email,
      firstName: firstName,
      lastName: lastName,
    },
    submittingUser: {
      firstName: salesRepFirstName,
      lastName: salesRepLastName,
      email: salesRepEmail,
      phone: salesRepPhone,
    },
    amount: {
      value: loanAmount,
      type: "USD",
    },
    sendEmail: false,
    enrollments: [autopayIntent ? "AUTOPAY" : ""],
  });
};

const Home = () => {
  const [token, setToken] = useState("");
  const [spinner, setSpinner] = useState(false);

  const handleClick = async (payload) => {
    console.log(JSON.parse(payload, null, 2));
    setSpinner(true);
    const myInit = {
      body: { data: payload || {} },
      queryStringParameters: {
        apiId: "customerSuccessApiId",
        apiKey: "customerSuccessApiKey",
      },
    };
    const data = await API.post("developerApi", "/loans-share", myInit);
    console.log(data);
    setToken(data.link);
    if (token !== "") setSpinner(false);
  };

  return (
    <>
      {token !== "" ? (
        <Box>
          <iframe
            id="inlineFrameExample"
            title="SharedApp"
            className="iframe"
            allowFullScreen
            src={token}
          />
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: 960,
            mx: "auto",
            position: "absolute",
            top: "0",
            left: "0",
          }}
        >
          <Box>
            <Heading sx={{ width: "960px", backgroundColor: "#003439" }}>
              <img src={logo} alt="GoodLeap" style={styles.logo} />
            </Heading>
          </Box>
          <Form
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              categoryId: "",
              state: "CA",
              groupId: "",
              referenceNumber: "",
              offerId: "eb26fdb4-afe9-452a-981e-d89c0b2355e4",
              loanAmount: "25000",
              autopayIntent: true,
              salesRepFirstName: "Hector",
              salesRepLastName: "Sanchez",
              salesRepEmail: "hsanchez+il@goodleap.com",
              salesRepPhone: "6502077716",
            }}
            enableReinitialize
            validationSchema={object({
              firstName: string().required(`Enter your first name`),
              lastName: string().required(`Enter your last name`),
              email: string()
                .email("Enter a valid email address, like j.doe@example.com")
                .required(`Enter the borrower's email address`),
            })}
            onSubmit={({ ...values }) => {
              handleClick(buildPaydown(values));
            }}
            showSummary={false}
          >
            <Card
              sx={{
                maxWidth: 960,
              }}
            >
              <Box sx={{ pl: 4, pr: 4, pb: 4 }}>
                <Heading variant="h4">
                  Thank you for applying for financing. Let's get started!
                </Heading>
                <Box as="p" sx={{ mb: 4 }}>
                  &nbsp;
                </Box>
                <Box>
                  <Grid columns={[1, 2]} gap={[0, 3]}>
                    <TextInput
                      name="firstName"
                      label="First name"
                      autoComplete="off"
                    />
                    <TextInput
                      name="lastName"
                      label="Last name"
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid columns={[1, 2]} gap={[0, 3]}>
                    <TextInput
                      name="email"
                      label="Email address"
                      autoComplete="off"
                      type="email"
                    />
                    <TextInput name="state" label={"State"} size={2} />
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    my: 3,
                    borderTop: "1px solid",
                    borderTopColor: "neutral.l3",
                  }}
                >
                  {spinner ? (
                    <>
                      <Button type="submit" sx={{ mt: 3, px: 5 }} disabled>
                        APPLY NOW
                      </Button>
                      <Spinner
                        title="loading"
                        size="32"
                        sx={{ mt: 3, px: 3, color: "#FF8300" }}
                      />
                    </>
                  ) : (
                    <Button type="submit" sx={{ mt: 3, px: 5 }}>
                      APPLY NOW
                    </Button>
                  )}
                </Box>
              </Box>
            </Card>
          </Form>
        </Box>
      )}
    </>
  );
};

const styles = {
  logo: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    backgroundColor: "#003439",
  },
};

export default Home;
