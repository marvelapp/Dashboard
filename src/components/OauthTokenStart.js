import React from "react";

import { ClientId, MarvelUrl, Scopes } from "../utils/config";

class OauthTokenStart extends React.Component {
  redirectToOauth() {
    const scopesEscaped = encodeURIComponent(Scopes.trim());
    const oauthRedirect =
      MarvelUrl +
      "/oauth/authorize/?approval_prompt=auto&client_id=" +
      ClientId +
      "&response_type=token&redirect_uri=" +
      document.location.protocol +
      "//" +
      document.location.host +
      "/oauth/callback" +
      "&scope=" +
      scopesEscaped;
    window.location.href = oauthRedirect;
  }

  render() {
    this.redirectToOauth();
    return null;
  }
}

export default OauthTokenStart;

export const Callback = "http://localhost:3000/oauth/callback";
