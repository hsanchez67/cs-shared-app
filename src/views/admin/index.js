import React, { useEffect, useState, useTheme } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { createSharedApp, updateSharedApp } from "../../graphql/mutations";
import { listSharedApps } from "../../graphql/queries";
import { Heading } from "@loanpal/lumos__core";
import { Box } from "theme-ui";
import logo from "../../images/goodleap-white-orange.svg";

import {
  // withAuthenticator,
  Authenticator,
  Button,
  TextField,
  SwitchField,
  Divider,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TextAreaField,
  SearchField,
  View,
  Flex,
  Text,
  Image,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "../../aws-exports";
Amplify.configure(awsExports);

const initialState = {
  id: "",
  clientId: "",
  offerId: "",
  states: "",
  loanAmount: 0.0,
  sendEmail: false,
  displayIframe: true,
  referenceId: "lastName",
  formUrl: "",
  submittingUserFname: "",
  submittingUserLname: "",
  submittingUserEmail: "",
  submittingUserPhone: "",
};

const formFields = {
  confirmVerifyUser: {
    confirmation_code: {
      labelHidden: false,
      label: "New Label",
      placeholder: "Enter your Confirmation Code:",
      isRequired: false,
    },
  },
};

const components = {
  Header() {
    return (
      <View textAlign="center" style={styles.heading}>
        <Image alt="GoodLeap" src={logo} style={styles.logo} />
      </View>
    );
  },

  VerifyUser: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },

  ConfirmVerifyUser: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
};

const Admin = () => {
  const [formState, setFormState] = useState(initialState);
  const [SharedApps, setSharedApps] = useState([]);

  useEffect(() => {
    fetchSharedApps();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchSharedApps() {
    try {
      const appData = await API.graphql(graphqlOperation(listSharedApps));
      const SharedApps = appData.data.listSharedApps.items;
      setSharedApps(SharedApps);
    } catch (err) {
      console.log("error fetching SharedApps");
    }
  }

  const loadSharedApp = (app) => {
    const appState = {
      id: app.id,
      clientId: app.clientId,
      offerId: app.offerId,
      states: JSON.parse(app.states),
      loanAmount: app.loanAmount,
      offers: app.offers,
      sendEmail: app.sendEmail,
      displayIframe: app.displayIframe,
      referenceId: app.referenceId,
      formUrl: app.formUrl,
      submittingUserFname: app.submittingUser.firstName,
      submittingUserLname: app.submittingUser.lastName,
      submittingUserEmail: app.submittingUser.email,
      submittingUserPhone: app.submittingUser.phone,
    };
    setFormState(appState);
  };

  /* valid offeers
  JSON.stringify({
        data: [
          {
            id: "eb26fdb4-afe9-452a-981e-d89c0b2355e4",
            states: [
              "AZ",
              "CA",
              "CO",
              "CT",
              "FL",
              "GA",
              "MD",
              "MO",
              "MS",
              "NC",
              "NJ",
              "NM",
              "NV",
              "SC",
              "TN",
              "TX",
              "UT",
              "VA",
              "WI",
            ],
          },
        ],
      })
  */

  const buildApp = (app, update) => {
    if (update)
      return {
        id: app.id ? app.id : "",
        clientId: app.clientId,
        offerId: app.offerId,
        loanAmount: app.loanAmount,
        states: JSON.stringify(app.states.replace(/\s/g, "")),
        offers: JSON.stringify({}),
        submittingUser: {
          firstName: app.submittingUserFname,
          lastName: app.submittingUserLname,
          email: app.submittingUserEmail,
          phone: app.submittingUserPhone,
        },
        sendEmail: app.sendEmail,
        displayIframe: app.displayIframe,
        referenceId: app.referenceId,
        formUrl: app.formUrl,
      };
    else
      return {
        clientId: app.clientId,
        offerId: app.offerId,
        loanAmount: app.loanAmount,
        states: JSON.stringify(app.states.replace(/\s/g, "")),
        offers: JSON.stringify({}),
        submittingUser: {
          firstName: app.submittingUserFname,
          lastName: app.submittingUserLname,
          email: app.submittingUserEmail,
          phone: app.submittingUserPhone,
        },
        sendEmail: app.sendEmail,
        displayIframe: app.displayIframe,
        referenceId: app.referenceId,
        formUrl: app.formUrl,
      };
  };

  async function addSharedApp() {
    try {
      if (
        !formState.clientId ||
        !formState.offerId ||
        !formState.submittingUserEmail ||
        !formState.submittingUserFname ||
        !formState.submittingUserLname
      )
        return;
      const app = buildApp(formState, formState.id !== "");
      console.log(app);
      if (formState.id !== "") {
        await API.graphql(graphqlOperation(updateSharedApp, { input: app }));
      } else {
        await API.graphql(graphqlOperation(createSharedApp, { input: app }));
      }
      setFormState(initialState);
      setSharedApps([]);
      fetchSharedApps();
    } catch (err) {
      console.log("Error saving configuration:", err);
    }
  }

  return (
    <Authenticator
      formFields={formFields}
      components={components}
      hideSignUp={true}
    >
      {({ signOut }) => (
        <>
          <Button onClick={signOut} style={styles.signOut}>
            Sign out
          </Button>
          <div style={styles.container}>
            <Box>
              <Heading
                sx={{
                  width: "960px",
                  backgroundColor: "#003439",
                  marginBottom: "25px",
                }}
              >
                <img src={logo} alt="GoodLeap" style={styles.logo} />
              </Heading>
            </Box>
            <TextField
              variation="default"
              value={formState.id}
              label="Id"
              style={styles.input}
              isDisabled
            />
            <TextField
              onChange={(event) => setInput("clientId", event.target.value)}
              variation="default"
              value={formState.clientId}
              label="Client Id"
              style={styles.input}
            />
            <TextField
              onChange={(event) => setInput("offerId", event.target.value)}
              style={styles.input}
              value={formState.offerId}
              label="Offer Id"
            />
            <TextAreaField
              autoComplete="off"
              descriptiveText={`Enter the states valid for the offer above in the array. e.g. ["AZ","CA","CO","CT","FL"`}
              value={formState.states}
              style={styles.input}
              direction="column"
              label="States"
              rows="3"
              wrap="nowrap"
              onChange={(event) => setInput("states", event.target.value)}
            />
            <TextField
              onChange={(event) => setInput("loanAmount", event.target.value)}
              style={styles.input}
              descriptiveText="Two point precision decimal."
              value={formState.loanAmount}
              label="Loan Amount"
            />
            <TextField
              label="Submitting User Email"
              onChange={(event) =>
                setInput("submittingUserEmail", event.target.value)
              }
              style={styles.input}
              value={formState.submittingUserEmail}
            />
            <TextField
              label="Submitting User First Name"
              onChange={(event) =>
                setInput("submittingUserFname", event.target.value)
              }
              style={styles.input}
              value={formState.submittingUserFname}
            />
            <TextField
              label="Submitting User Last Name"
              onChange={(event) =>
                setInput("submittingUserLname", event.target.value)
              }
              style={styles.input}
              value={formState.submittingUserLname}
            />
            <TextField
              label="Submitting User Phone"
              onChange={(event) =>
                setInput("submittingUserPhone", event.target.value)
              }
              descriptiveText="10 digits, no other characters"
              style={styles.input}
              value={formState.submittingUserPhone}
            />
            <TextField
              label="Refererence Id logic"
              onChange={(event) => setInput("referenceId", event.target.value)}
              style={styles.input}
              value={formState.referenceId}
            />
            <TextField
              label="Form URL"
              onChange={(event) => setInput("formUrl", event.target.value)}
              style={styles.input}
              value={formState.formUrl}
            />
            <SwitchField
              isDisabled={false}
              label="sendEmail"
              labelPosition="end"
              size="large"
              isChecked={formState.sendEmail}
              onChange={(event) => setInput("sendEmail", event.target.checked)}
            />
            <SwitchField
              isDisabled={false}
              label="displayIframe"
              labelPosition="end"
              size="large"
              isChecked={formState.displayIframe}
              onChange={(event) =>
                setInput("dispalyIframe", event.target.checked)
              }
            />
            <Divider
              orientation="horizontal"
              style={styles.divider}
              size="small"
            />
            <Button
              style={styles.button}
              isFullWidth={false}
              isDisabled={false}
              onClick={addSharedApp}
            >
              Save partner config
            </Button>
            <Divider
              orientation="horizontal"
              style={styles.divider}
              size="small"
            />
            <Box>
              <Heading
                sx={{
                  backgroundColor: "#ffffff",
                  marginBottom: "20px",
                  marginTop: "50px",
                  fontSize: "30px",
                }}
              >
                <Flex
                  direction="row"
                  justifyContent="space-between"
                  alignItems="stretch"
                  alignContent="flex-start"
                  wrap="nowrap"
                  gap="1rem"
                >
                  <View>Partner List</View>
                  <SearchField
                    label="Search"
                    placeholder="Search by Client Id"
                    size="default"
                  />
                </Flex>
              </Heading>
              <Table caption="" highlightOnHover={true} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell as="th">Client ID</TableCell>
                    <TableCell as="th">id</TableCell>
                    <TableCell as="th"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SharedApps.map((app, index) => (
                    <TableRow key={app.id ? app.id : index}>
                      <TableCell>{app.clientId}</TableCell>
                      <TableCell>{app.id}</TableCell>
                      <TableCell>
                        <Button
                          loadingText=""
                          onClick={() => loadSharedApp(app)}
                          ariaLabel=""
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box
              sx={{
                marginBottom: "100px",
              }}
            >
              &nbsp;
            </Box>
          </div>
        </>
      )}
    </Authenticator>
  );
};

const styles = {
  container: {
    width: 960,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // padding: 20,
  },
  divider: { margin: "25px 0", color: "white" },
  app: { marginBottom: 15 },
  input: {
    marginBottom: 20,
    padding: 8,
    fontSize: 18,
  },
  appClientId: { fontSize: 20, fontWeight: "bold" },
  appFields: { marginBottom: 0 },
  button: {
    backgroundColor: "#003439",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
    cursor: "pointer",
  },
  signOut: {
    backgroundColor: "#FF8300",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px",
  },
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

export default Admin;
