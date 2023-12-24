"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTheme,
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Logout as LogoutIcon, Menu as MenuIcon } from "@mui/icons-material";
import Link from "next/link";
declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    desktop: true;
  }
}

const defaultTheme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      desktop: 600,
    },
  },
});
export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };

  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
  };

  const handleSideMenuLink = (path: string) => {
    router.push(path);
    toggleDrawer(false);
  };

  const list = () => (
    <Box sx={{ width: 240 }}>
      <Toolbar />
      <Divider />
      <List>
        <ListItem
          onClick={() => handleSideMenuLink("/inventory/products")}
          disablePadding
        >
          <ListItemButton>
            <ListItemText primary="商品一覧" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem
          onClick={() => handleSideMenuLink("/inventory/import_sales")}
          disablePadding
        >
          <ListItemButton>
            <ListItemText primary="売上一括登録" />
          </ListItemButton>
        </ListItem>
        <Divider />
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton onClick={() => toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              在庫管理システム
            </Typography>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={() => handleLogout()}
            >
              ログアウト
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer open={open} onClose={() => toggleDrawer(false)} anchor="left">
          {list()}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,

            marginTop: "64px",
            width: "100%",
            background: "white",
          }}
        >
          {children}
        </Box>
        <Box
          component="footer"
          sx={{
            width: "100%",
            position: "fixed",
            textAlign: "center",
            bottom: 0,
            background: "#1976d2",
          }}
        >
          <Typography variant="caption" color="white">
            ©2023 full stack web development
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
