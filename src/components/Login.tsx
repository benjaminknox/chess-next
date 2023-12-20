import { useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from 'next/router';
import { LoadingButton } from "@mui/lab";
import { Space } from "../components/Space";
import { Alert, Grid, Paper, TextField, Typography } from "@mui/material";

interface ILoginWrapper {
  component: typeof Grid;
}

const LoginWrapper = styled(Grid)<ILoginWrapper>`
  padding: 10px;
  width: 300px;
`;

export interface LoginFormProps {
  loading?: boolean;
  csrfToken?:string;
  passwordFailed?: string;
  usernameFailed?: string;
  submitFailed?: string | null;
  onSubmit?: (evt: React.FormEvent<HTMLFormElement>) => void;
}

export function Login({
  loading,
  onSubmit,
  csrfToken,
  submitFailed,
  passwordFailed,
  usernameFailed,
}: LoginFormProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    onSubmit && onSubmit(evt);
  };

  const renderSubmitFailed = function () {
    if (submitFailed) {
      return (
        <>
          <Space size={20} />
          <Grid item xs>
            <Alert severity="error" data-cy="login-form-error">
              {submitFailed}
            </Alert>
          </Grid>
        </>
      );
    }
  };

  return (
    <form
      action="/api/auth/callback/credentials"
      method="post"
      onSubmit={handleFormSubmit}
      data-cy="login-form"
    >
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <LoginWrapper
        container
        direction="column"
        alignItems="center"
        data-cy="login-form-wrapper"
        component={Paper}
        spacing={1}
      >
        <Grid item xs data-cy="login-form-header">
          <Typography variant="h6">Welcome To Chess</Typography>
        </Grid>
        <Space size={20} />
        <Grid item xs>
          <TextField
            data-cy="login-form-username"
            error={!!usernameFailed}
            helperText={usernameFailed && usernameFailed}
            name="username"
            label="username"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            data-cy="login-form-password"
            type="password"
            label="password"
            error={!!passwordFailed}
            helperText={passwordFailed && passwordFailed}
            name="password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </Grid>
        {renderSubmitFailed()}
        <Space size={20} />
        <Grid item xs>
          <LoadingButton
            type="submit"
            loading={loading}
            variant="contained"
            data-cy="login-form-submit"
            disableElevation
          >
            Sign in
          </LoadingButton>
        </Grid>
        <Space size={20} />
      </LoginWrapper>
    </form>
  );
}
