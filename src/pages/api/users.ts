import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getKeycloakAdminAccess } from "../../utils/getKeycloakAdminAccess"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin: any = await getKeycloakAdminAccess()

  const response = await axios({
    url: `${process.env.KEYCLOAK_URI}/auth/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
    method: 'GET',
    headers: { authorization: `${admin.data.token_type} ${admin.data.access_token}` },
  })

  res.status(200).json(response.data)
}
