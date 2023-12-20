import qs from 'qs';
import axios from "axios";

export const getKeycloakAdminAccess = async () =>
  await axios({
    url: `${process.env.KEYCLOAK_URI}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    data: qs.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      grant_type: "client_credentials",
      client_secret: process.env.OAUTH_CLIENT_SECRET,
    }),
  });
