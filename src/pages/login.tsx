import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { Grid } from '@mui/material'
import { useRouter } from "next/router";
import { Login } from "../components/Login";
import { getCsrfToken } from "next-auth/react";

export default function LoginPage({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { query } = useRouter();

  let submitFailed = null;

  if (query.error === "CredentialsSignin") {
    submitFailed = "The username and password combination did not work";
  }

  return (
    <Grid
      display="flex"
      direction="column"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Login csrfToken={csrfToken} submitFailed={submitFailed} />
    </Grid>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
