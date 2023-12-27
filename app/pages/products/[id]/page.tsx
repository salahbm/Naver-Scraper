"use client";
import { redirect } from "next/navigation";

import { FC, useEffect, useState } from "react";

interface pageProps {
  params: { id: string };
}
const ProductDetails: FC<pageProps> = ({ params }) => {
  const [product, setProduct] = useState<any>([]);
  console.log(`file: page.tsx:11 ~ product:`, product);
  useEffect(() => {
    function fetchLocal() {
      try {
        // Retrieve stored data from local storage and parse it
        const storedDataJson: string | null =
          localStorage.getItem("storedData");
        const storedData = JSON.parse(storedDataJson || "[]");

        // Find the data based on the provided phone number
        const foundData = storedData.find(
          (data: any) => data.phone === params.id
        );

        // Return the found data or null if not found
        setProduct(foundData);
      } catch (error) {
        // Handle errors, e.g., if JSON parsing fails
        console.error("Error fetching local data:", error);
        return null;
      }
    }
    fetchLocal();
  }, []);

  if (!product) redirect("/");

  return (
    <section className="max-w-[1240px] mx-auto rounded-lg " key={params.id}>
      <div className="flex items-center justify-center">
        <img
          className="max-w-md h-64 object-cover object-center "
          src={product?.logo}
          alt={product?.name}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-green-500">
            {product?.name}
          </h2>
          <p className="text-sm text-gray-600">{product?.category}</p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-gray-700">{product?.address}</p>
          <p className="text-gray-700">{product?.phone}</p>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-green-500">Reviews</h3>
        <div className="flex items-center justify-between ">
          <p className="text-gray-700">{product?.visitorsReview}</p>
          <p className="text-gray-700">{product?.blogReview}</p>
        </div>
        <div className="mt-2">
          <h3 className="text-lg font-semibold mb-2 text-green-500">
            Social Links:
          </h3>
          <ul>
            {product?.socialLinks?.map((link: any, index: number) => (
              <li key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {product.menu !== "not available" ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-green-500">Menu:</h3>
            <ul>
              {product?.menu?.map((item: any, index: number) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold from-neutral-700">
                      {item.name}
                    </p>
                    <p className="text-green-600 font-bold">{item.price}</p>
                  </div>
                  <img
                    className="w-20 h-20 object-cover"
                    src={item.imageUrl}
                    alt={item.name}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductDetails;
