"use client";

import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import axios from "@/lib/plugins/axios";

type FormData = {
  username: string;
  password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const defaultTheme = createTheme();
  const onSubmit = (event: any): void => {
    const data: FormData = {
      username: event.username,
      password: event.password,
    };
    handleLogin(data);
  };

  const handleLogin = (data: FormData) => {
    axios
      .post("/api/inventory/login", data)
      .then((response) => {
        router.push("/inventory/products");
      })
      .catch((error) => {
        setAuthError("ユーザー名またはパスワードに誤りがあります。");
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            ログイン
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {authError && (
              <Typography variant="body2" color="error">
                {authError}
              </Typography>
            )}{" "}
            <TextField
              type="text"
              id="username"
              variant="filled"
              label="ユーザー名（必須）"
              fullWidth
              margin="normal"
              {...register("username", { required: "必須入力です。" })}
              error={Boolean(errors.username)}
              helperText={errors.username?.message?.toString() || ""}
            />
            <TextField
              type="password"
              id="password"
              variant="filled"
              label="パスワード（必須）"
              autoComplete="current-password"
              fullWidth
              margin="normal"
              {...register("password", {
                required: "必須入力です。",
                minLength: {
                  value: 8,
                  message: "8文字以上の文字列にしてください。",
                },
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message?.toString() || ""}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              ログイン
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
