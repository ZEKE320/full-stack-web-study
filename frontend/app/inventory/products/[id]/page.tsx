"use client";

import {
  Alert,
  AlertColor,
  Box,
  Button,
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
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import productsData from "../sample/dummy_products.json";
import inventoriesData from "../sample/dummy_inventories.json";

type ProductData = {
  id: number;
  name: string;
  price: number;
  description: string;
};

type FormData = {
  id: number;
  quantity: number;
};

type InventoryData = {
  id: number;
  type: string;
  date: string;
  unit: number;
  quantity: number;
  price: number;
  inventory: number;
};

export default function PagePage({ params }: { params: { id: number } }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [product, setProduct] = useState<ProductData>({
    id: 0,
    name: "",
    price: 0,
    description: "",
  });
  const [data, setData] = useState<Array<InventoryData>>([]);

  const [action, setAction] = useState<string>("");
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
    const selectedProduct: ProductData = productsData.find(
      (v) => v.id == params.id
    ) ?? {
      id: 0,
      name: "",
      price: 0,
      description: "",
    };
    setProduct(selectedProduct);
    setData(inventoriesData);
  }, [open]);

  const onSubmit = (event: any): void => {
    const data: FormData = {
      id: Number(params.id),
      quantity: Number(event.quantity),
    };

    if (action === "purchase") {
      handlePurchase(data);
    } else if (action === "sell") {
      if (data.id === null) {
        return;
      }
      handleSell(data);
    }
  };

  const handlePurchase = (data: FormData) => {
    result("success", "商品を仕入れました");
  };

  const handleSell = (data: FormData) => {
    result("success", "商品を卸しました");
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      <Typography variant="h5">商品在庫管理</Typography>
      <Typography variant="h6">在庫処理</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <TextField
            disabled
            fullWidth
            id="name"
            label="商品名"
            variant="filled"
            value={product.name}
          />
        </Box>
        <Box>
          <TextField
            type="number"
            id="quantity"
            variant="filled"
            label="数量"
            {...register("quantity", {
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
            error={Boolean(errors.quantity)}
            helperText={errors.quantity?.message?.toString() || ""}
          />
        </Box>
        <Button
          variant="contained"
          type="submit"
          onClick={() => setAction("purchase")}
        >
          商品を仕入れる
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => setAction("sell")}
        >
          商品を卸す
        </Button>
      </Box>
      <Typography variant="h6">在庫履歴</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>処理種別</TableCell>
              <TableCell>処理日時</TableCell>
              <TableCell>単価</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>価格</TableCell>
              <TableCell>在庫数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data: InventoryData) => (
              <TableRow key={data.id}>
                <TableCell>{data.type}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.unit}</TableCell>
                <TableCell>{data.quantity}</TableCell>
                <TableCell>{data.price}</TableCell>
                <TableCell>{data.inventory}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
