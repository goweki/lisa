"use client";
import { useEffect, useState } from "react";
import * as Realm from "realm-web";

export default function useRealm() {
  const [app, setApp] = useState(null);
  // Run in useEffect so that App is not created in server-side environment
  useEffect(() => {
    console.log(`CHECKPOINT: Instantiating a new Realm app`);
    setApp(Realm.getApp(process.env.NEXT_PUBLIC_ATLAS_APPSERVE_ID));
  }, []);

  //register new user
  async function registerUser(email, password) {
    console.log(`CHECKPOINT: Registration attempt...`);
    console.log(` > app: ${app}`);
    console.log(` >> user: ${email}`);
    console.log(` >> user: ${password}`);
    // Attempt registration using realmApp
    try {
      return await app.emailPasswordAuth.registerUser({ email, password });
    } catch (e) {
      console.log(`Catching error...20230915........${e}`);
      return e.error;
    }
  }

  //sign-in function
  async function signInUser(username, password) {
    const credentials = Realm.Credentials.emailPassword(
      username.toLowerCase(),
      password
    );
    try {
      const user = await app.logIn(credentials);
      // `App.currentUser` updates to match the logged in user
      if (user.id === app.currentUser.id) {
        return { user };
      }
      throw "Sign in failed";
    } catch (e) {
      console.log("ERROR: caught:" + JSON.stringify(e));
      return e;
    }
  }

  //update Custom Data function
  async function updateCustomData(customDat_) {
    try {
      // Refresh the user's local customData property
      await app.currentUser.refreshCustomData();
      //
      const mongo = app.currentUser.mongoClient(
        NEXT_PUBLIC_CLUSTER_DATA_SOURCE
      );
      const collection = mongo.db(NEXT_PUBLIC_CLUSTER_DB).collection("users");
      // Update the user's custom data document
      await collection.updateOne(
        { userId: app.currentUser.id }, // Query for the user object of the logged in user
        { $set: { ...customDat_ } } // Set the logged in user's favorite color to purple
      );
    } catch (e) {
      return e;
    }
  }

  //sign-out function
  async function signOutUser() {
    try {
      console.log(`ACTION: Logout clicked...`);
      await app.currentUser?.logOut();
      return "success";
    } catch (e) {
      return e.error;
    }
  }

  //send reset-link to email
  async function sendResetPasswordEmail(email) {
    try {
      await app.emailPasswordAuth.sendResetPasswordEmail({ email });
      return "success";
    } catch (e) {
      return e.error;
    }
  }

  //reset password link - update new password
  async function updatePassword(password, token, tokenId) {
    try {
      await app.emailPasswordAuth.resetPassword({
        password: password,
        token,
        tokenId,
      });
      return "success";
    } catch (e) {
      return e.error;
    }
  }
  // return
  return {
    app,
    registerUser,
    signInUser,
    updateCustomData,
    signOutUser,
    updatePassword,
    sendResetPasswordEmail,
  };
}
