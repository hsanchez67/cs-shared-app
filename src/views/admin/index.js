import React, { useEffect, useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { createSharedApp } from "../../graphql/mutations";
import { listSharedApps } from "../../graphql/queries";
import { Heading } from "@loanpal/lumos__core";
import { Box } from "theme-ui";
import logo from "../../images/goodleap-white-orange.svg";

import { withAuthenticator, Button, TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "../../aws-exports";
Amplify.configure(awsExports);

const initialState = { clientId: "", configuration: "" };

const Admin = ({ signOut }) => {
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

  async function addSharedApp() {
    try {
      if (!formState.clientId || !formState.configuration) return;
      const app = { ...formState };
      setSharedApps([...SharedApps, app]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createSharedApp, { input: app }));
    } catch (err) {
      console.log("Error saving configuration:", err);
    }
  }

  return (
    <>
      <Button onClick={signOut} style={styles.signOut}>
        Sign out
      </Button>
      <div style={styles.container}>
        <Box>
          <Heading sx={{ width: "960px", backgroundColor: "#003439" }}>
            <img src={logo} alt="GoodLeap" style={styles.logo} />
          </Heading>
        </Box>
        <TextField
          onChange={(event) => setInput("clientId", event.target.value)}
          style={styles.input}
          value={formState.clientId}
          placeholder="clientId"
          descriptiveText="ClientId"
        />
        <TextField
          onChange={(event) => setInput("configuration", event.target.value)}
          style={styles.input}
          value={formState.configuration}
          placeholder="Configuration"
        />
        <Button
          style={styles.button}
          isFullWidth={false}
          isDisabled={true}
          onClick={addSharedApp}
        >
          Save partner config
        </Button>
        {SharedApps.map((app, index) => (
          <div key={app.id ? app.id : index} style={styles.app}>
            <p style={styles.appClientId}>{app.clientId}</p>
            <p style={styles.appConfiguration}>{app.configuration}</p>
          </div>
        ))}
      </div>
    </>
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
  app: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    // marginTop: 10,
    padding: 8,
    fontSize: 18,
  },
  appClientId: { fontSize: 20, fontWeight: "bold" },
  appConfiguration: { marginBottom: 0 },
  button: {
    backgroundColor: "#003439",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
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

export default withAuthenticator(Admin);
