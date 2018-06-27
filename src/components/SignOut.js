import React from "react";
import { AuthTokenKey } from "../utils/config";

class SignOut extends React.Component {
  removeLocalToken() {
    localStorage.removeItem(AuthTokenKey);
  }

  render() {
    this.removeLocalToken();
    window.location.href = "/";
    return null;
  }
}

export default SignOut;
