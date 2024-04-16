import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";

import { CameraAlt } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/Styled/StyledComponents";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { userNameValidator } from "../utils/Validator";

import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import axios from "axios";
import { userExist } from "../redux/reducers/auth";
import { ToastBar, toast } from "react-hot-toast";

const Login = () => {
  const [Islogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toggleLogin = () => setIsLogin((prev) => !prev);
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const userName = useInputValidation("", userNameValidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: userName.value,
          password: password.value,
        },
        config
      );

      dispatch(userExist(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response.data.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    if (avatar.file) {
      formData.append("avatar", avatar.file);
    }
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", userName.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExist(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      component={"main"}
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {Islogin ? (
          <>
            <Typography variant="h5">Login</Typography>
            <form
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onSubmit={handleLogin}
            >
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={userName.value}
                onChange={userName.changeHandler}
              />

              {userName.error && (
                <Typography color="error" variant="caption">
                  {userName.error}
                </Typography>
              )}

              <TextField
                required
                fullWidth
                label="Password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />

              {password.error && (
                <Typography color="error" variant="caption">
                  {password.error}
                </Typography>
              )}

              <Button
                sx={{
                  marginTop: "1rem",
                }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                Login
              </Button>

              <Typography textAlign={"center"} m={"1rem"}>
                Or
              </Typography>

              <Button
                variant="text"
                fullWidth
                onClick={toggleLogin}
                disabled={isLoading}
              >
                SignUp instead
              </Button>
            </form>
          </>
        ) : (
          <>
            <Typography variant="h5">SignUp</Typography>
            <form
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onSubmit={handleSignup}
            >
              <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "contain",
                  }}
                  src={avatar.preview}
                />

                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.5",
                    },
                  }}
                  component="label"
                >
                  <>
                    <CameraAlt />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </>
                </IconButton>
              </Stack>

              <TextField
                required
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={name.value}
                onChange={name.changeHandler}
              />

              <TextField
                required
                fullWidth
                label="Bio"
                margin="normal"
                variant="outlined"
                value={bio.value}
                onChange={bio.changeHandler}
              />

              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={userName.value}
                onChange={userName.changeHandler}
              />

              {userName.error && (
                <Typography color="error" variant="caption">
                  {userName.error}
                </Typography>
              )}

              <TextField
                required
                fullWidth
                label="Password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />

              {password.error && (
                <Typography color="error" variant="caption">
                  {password.error}
                </Typography>
              )}

              <Button
                sx={{
                  marginTop: "1rem",
                }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                SignUp
              </Button>

              <Typography textAlign={"center"} m={"1rem"}>
                Or
              </Typography>

              <Button
                variant="text"
                fullWidth
                onClick={toggleLogin}
                disabled={isLoading}
              >
                Login instead
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
