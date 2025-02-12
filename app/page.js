"use client";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // 環境変数からAPIのベースURLを取得

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBarcode(manualInput); // 手動入力値をセット

    try {
      const apiUrl = `${API_BASE_URL}/api/product/${manualInput}`;
      console.log(`🔍 API リクエスト: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error("商品が見つかりません");
      }

      const data = await response.json();
      console.log("✅ API レスポンス:", data);

      setProduct(data);
      setError(null);
    } catch (err) {
      console.error("❌ API エラー:", err);
      setProduct(null);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">POSシステム - JANコード検索</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="JANコードを入力..."
          className="p-2 border rounded w-64"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          照合
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {product && (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p>価格: ¥{product.price}</p>
        </div>
      )}
    </div>
  );
}
