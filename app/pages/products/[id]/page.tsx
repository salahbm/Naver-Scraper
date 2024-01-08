"use client";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { getStoreById } from "@/lib/actions";
import { RestaurantCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface pageProps {
  params: { id: string };
}

const ProductNotAvailableNotice = () => (
  <div className="flex items-center justify-center h-screen flex-col">
    <p className="text-2xl font-semibold text-red-800">Product not available</p>
    <Link href={"/"}>
      <Button type="button" variant={"default"}>
        Go Back Home
      </Button>
    </Link>
  </div>
);

const ProductDetails = ({ params }: pageProps) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<RestaurantCardProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`file: page.tsx:14 ~ params:`, params.id);
        const fetchedProduct: RestaurantCardProps = await getStoreById(
          params.id
        );
        console.log(`file: page.tsx:15 ~ product:`, fetchedProduct);

        setProduct(fetchedProduct);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <>
      {loading && <Loader />}
      {!loading && !product ? (
        <ProductNotAvailableNotice />
      ) : (
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
            <h3 className="text-lg font-semibold mb-2 text-green-500">
              Reviews
            </h3>
            <div className="flex items-center justify-between ">
              <p className="text-gray-700">{product?.visitorsReview}</p>
              <p className="text-gray-700">{product?.blogReview}</p>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-2 text-green-500">
                Social Links:
              </h3>
              <ul>
                {product?.socialLinks?.map((link: string, index: number) => (
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
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-2 text-green-500">
                Reviews:
              </h3>
              <ul>
                {product?.reviews?.map((review: any, index: number) => (
                  <li key={index}>
                    <p>
                      {review.type}: {review.count}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetails;
