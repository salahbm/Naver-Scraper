import { RestaurantCardProps } from "@/types";
import { RestaurantProps } from "@/types";
import Link from "next/link";
import React from "react";

interface Props {
  keyId: string;
  data: RestaurantCardProps;
}

const RestaurantCard = ({ keyId, data }: Props) => {
  if (!data) return;
  return (
    <Link href={`/pages/products/${keyId}`}>
      <div className="max-w-lg  mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          className="w-full h-64 object-cover object-center"
          src={data?.logo}
          alt={data?.name}
        />
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">{data?.name}</h2>
          <p className="text-sm text-gray-600">{data?.category}</p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
