"use client";

import {
  Alert,
  AlertColor,
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";
import productsData from "./sample/dummy_products.json";

type ProductData = {
  id: number | null;
  name: string;
  price: number;
  description: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState<Array<ProductData>>([]);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [message, setMessage] = useState("");
  const result = (severity: AlertColor, message: string) => {
    setOpen(true);
    setSeverity(severity);
    setMessage(message);
  };

  const handleClose = (event: any, reason: any) => {
    setOpen(false);
  };

  useEffect(() => {
    setData(productsData);
  }, [open]);

  const [id, setId] = useState<number | null>(0);
  const [action, setAction] = useState<string>("");
  const onSubmit = (event: any): void => {
    const data: ProductData = {
      id: id,
      name: event.name,
      price: Number(event.price),
      description: event.description,
    };
    if (action === "add") {
      handleAdd(data);
    } else if (action === "update") {
      if (data.id === null) {
        return;
      }
      handleEdit(data);
    } else if (action === "delete") {
      if (data.id === null) {
        return;
      }
      handleDelete(data.id);
    }
  };

  const handleShowNewRow = () => {
    setId(null);
    reset({
      name: "",
      price: "0",
      description: "",
    });
  };
  const handleAddCancel = () => {
    setId(0);
  };
  const handleAdd = (data: ProductData) => {
    result("success", "商品が登録されました");
    setId(0);
  };

  const handleEditRow = (id: number | null) => {
    const selectedProduct: ProductData = data.find(
      (v) => v.id === id
    ) as ProductData;
    setId(selectedProduct.id);
    reset({
      name: selectedProduct.name,
      price: selectedProduct.price,
      description: selectedProduct.description,
    });
  };
  const handleEditCancel = () => {
    setId(0);
  };
  const handleEdit = (data: ProductData) => {
    result("success", "商品が更新されました");
    setId(0);
  };
  const handleDelete = (id: number) => {
    result("success", "商品が削除されました");
    setId(0);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      <Typography variant="h5">商品一覧</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleShowNewRow()}
      >
        商品を追加する
      </Button>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ height: 400, width: "100%" }}
      >
        <TableContainer component={Paper}>
          <Table
            sx={{
              display: { mobile: "none", desktop: "table" },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>商品ID</TableCell>
                <TableCell>商品名</TableCell>
                <TableCell>単価</TableCell>
                <TableCell>説明</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {id === null ? (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      id="name"
                      {...register("name", {
                        required: "必須入力です。",
                        maxLength: {
                          value: 100,
                          message: "100文字以内の商品名を入力してください。",
                        },
                      })}
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message?.toString() || ""}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      id="price"
                      {...register("price", {
                        required: "必須入力です。",
                        min: {
                          value: 1,
                          message: "1から99999999の数値を入力してください",
                        },
                        max: {
                          value: 99999999,
                          message: "1から99999999の数値を入力してください",
                        },
                      })}
                      error={Boolean(errors.price)}
                      helperText={errors.price?.message?.toString() || ""}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      id="description"
                      {...register("description")}
                    />
                  </TableCell>
                  {/* ルーティングのために追加 */}
                  <TableCell></TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => handleAddCancel()}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={() => setAction("add")}
                    >
                      登録する
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}
              {data.map((data: any) =>
                id === data.id ? (
                  <TableRow key={data.id}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        id="name"
                        {...register("name", {
                          required: "必須入力です。",
                          maxLength: {
                            value: 100,
                            message: "100文字以内の商品名を入力してください。",
                          },
                        })}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message?.toString() || ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        id="price"
                        {...register("price", {
                          required: "必須入力です。",
                          min: {
                            value: 1,
                            message: "1から99999999の数値を入力してください",
                          },
                          max: {
                            value: 99999999,
                            message: "1から99999999の数値を入力してください",
                          },
                        })}
                        error={Boolean(errors.price)}
                        helperText={errors.price?.message?.toString() || ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        id="description"
                        {...register("description")}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => handleEditCancel()}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => setAction("update")}
                      >
                        更新する
                      </Button>
                      <IconButton
                        aria-label="削除する"
                        type="submit"
                        color="warning"
                        onClick={() => setAction("delete")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={data.id}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.price}</TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>
                      <Link href={`/inventory/products/${data.id}`}>
                        在庫処理
                      </Link>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="編集する"
                        color="primary"
                        onClick={() => handleEditRow(data.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
