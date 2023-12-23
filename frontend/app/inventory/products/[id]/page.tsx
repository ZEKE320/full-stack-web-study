"use client";

import { InventoryData } from "@/lib/types/Inventory";
import { ProductData } from "@/lib/types/Product";
import { useEffect, useState } from "react";
import inventoriesData from "../sample/dummy_inventories.json";
import productsData from "../sample/dummy_products.json";
import { useForm } from "react-hook-form";
import { ProductFormData } from "@/lib/types/Product";

const Page = ({ params }: { params: { id: number } }) => {
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

  useEffect(() => {
    const selectedProduct: ProductData = productsData.find(
      (v) => v.id == params.id
    ) ?? { id: 0, name: "", price: 0, description: "" };
    setProduct(selectedProduct);
    setData(inventoriesData);
  }, []);

  const onSubmit = (event): void => {
    const data: ProductFormData = {
      id: Number(params.id),
      quantity: Number(event.quantity),
    };

    // actionによってHTTPメソッドと使用するパラメーターを切り替える
    if (action === "purchase") {
      handlePurchase();
    } else if (action === "sell") {
      if (data.id === null) {
        return;
      }
      handleSell();
    }
  };

  // 仕入れ・卸し処理
  const handlePurchase = () => {
    alert("商品を仕入れました");
  };

  const handleSell = () => {
    alert("商品を卸しました");
  };

  return (
    <>
      <h2>商品在庫管理</h2>
      <h3>在庫処理</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>商品名：</label>
          <input
            type="text"
            id="name"
            value={product.name}
            {...register("name")}
          ></input>
        </div>
        <div>
          <label>数量：</label>
          <input
            type="number"
            id="quantity"
            {...register("quantity", {
              required: "必須入力です",
              min: {
                value: 1,
                message: "1から99999999の数値を入力してください",
              },
              max: {
                value: 99999999,
                message: "1から99999999の数値を入力してください",
              },
            })}
          />
          {errors.quantity && (
            <div>{errors.quantity?.message?.toString() || ""}</div>
          )}
        </div>
        <button type="submit" onClick={() => setAction("purchase")}>
          商品を仕入れる
        </button>
        <button type="submit" onClick={() => setAction("sell")}>
          商品を卸す
        </button>
      </form>
      <h3>在庫履歴</h3>
      <table>
        <thead>
          <tr>
            <th>処理種目</th>
            <th>処理日時</th>
            <th>単価</th>
            <th>数量</th>
            <th>価格</th>
            <th>在庫数</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data: InventoryData) => (
            <tr key={data.id}>
              <td>{data.type}</td>
              <td>{data.date}</td>
              <td>{data.unit}</td>
              <td>{data.quantity}</td>
              <td>{data.price}</td>
              <td>{data.inventory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Page;
