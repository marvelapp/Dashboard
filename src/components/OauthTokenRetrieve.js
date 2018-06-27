import React from "react";
import { AuthTokenKey } from "../utils/config";

class OauthTokenRetrieve extends React.Component {
  render() {
    let accessToken = document.location.href.match(
      /#(?:access_token)=([\S\s]*?)&/
    )[1];
    localStorage.setItem(AuthTokenKey, accessToken);
    window.location.href = "/dashboard";
    return null;
  }
}

export default OauthTokenRetrieve;
