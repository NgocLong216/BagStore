import { useEffect, useState } from "react";
import { CiTrophy } from "react-icons/ci";

export default function TopProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/dashboard/top-products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <CiTrophy/> Top sản phẩm bán chạy
      </h2>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Sản phẩm</th>
            <th className="text-center">Đã bán</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.productId} className="border-t border-gray-300">
              <td className="py-3 flex items-center gap-3">
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                {p.productName}
              </td>
              <td className="font-bold text-center">{p.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
