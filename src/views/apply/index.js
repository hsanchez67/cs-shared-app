import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Grid, Spinner } from "theme-ui";
import {
  Heading,
  TextInput,
  Form,
  Button,
  SingleSelect,
} from "@loanpal/lumos__core";
import { object, string } from "yup";
import logo from "../../images/goodleap-white-orange.svg";
import Loading from "../../utils/loading";

// api
import { API, graphqlOperation } from "aws-amplify";
import { getSharedApp } from "../../graphql/queries";

const Home = () => {
  const [token, setToken] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [SharedApp, setSharedApp] = useState();
  const [states, setStates] = useState();

  useEffect(() => {
    fetchSharedApp(id);
  }, [id]);

  async function fetchSharedApp(id) {
    try {
      const appData = await API.graphql(
        graphqlOperation(getSharedApp, { id: id })
      );
      setSharedApp(appData.data.getSharedApp);
      setStates(JSON.parse(appData.data.getSharedApp.states));
      setLoading(false);
    } catch (err) {
      console.log("error fetching SharedApp");
    }
  }

  const handleClick = async (payload) => {
    try {
      setSpinner(true);
      console.log(payload);
      const myInit = {
        body: { data: payload || {} },
        queryStringParameters: {
          apiId: `${SharedApp.clientId}ApiId`,
          apiKey: `${SharedApp.clientId}ApiKey`,
        },
      };
      const data = await API.post("developerApi", "/loans-share", myInit);
      console.log(data);
      setToken(data.link);
      if (token !== "") setSpinner(false);
    } catch (err) {
      setSpinner(false);
      console.log("error creating Shared App");
    }
  };

  const buildPaydown = (values) => {
    if (
      !values.firstName ||
      !values.lastName ||
      !values.email ||
      !values.state
    ) {
      return;
    }
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

  let stateArray = [];
  let stateArrayOptions = [];
  if (states) {
    stateArray = JSON.parse(states);
    stateArrayOptions = stateArray
      .map((element) => [
        ...stateArrayOptions,
        { name: element, value: element },
      ])
      .flat();
  }

  return (
    <>
      {loading && <Loading />}
      {token !== "" && !loading ? (
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
              state: "",
              groupId: "",
              referenceNumber: "",
              offerId: SharedApp ? SharedApp.offerId : "",
              loanAmount: SharedApp ? SharedApp.loanAmount : 25000,
              autopayIntent: true,
              salesRepFirstName: SharedApp
                ? SharedApp.submittingUser.firstName
                : "",
              salesRepLastName: SharedApp
                ? SharedApp.submittingUser.lastName
                : "",
              salesRepEmail: SharedApp ? SharedApp.submittingUser.email : "",
              salesRepPhone:
                SharedApp && SharedApp.submittingUser.phone
                  ? SharedApp.submittingUser.phone
                  : "",
            }}
            enableReinitialize
            validationSchema={object({
              firstName: string().required(`Enter your first name`),
              lastName: string().required(`Enter your last name`),
              email: string()
                .email("Enter a valid email address, like j.doe@example.com")
                .required(`Enter the borrower's email address`),
              state: string().required(`Select state`),
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
                    {/* <TextInput name="state" label={"State"} size={2} /> */}
                    <Box sx={{ width: "30%", mr: 5 }}>
                      <SingleSelect
                        name="state"
                        label={"State"}
                        size={20}
                        items={stateArrayOptions}
                      />
                    </Box>
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
