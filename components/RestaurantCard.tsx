import { RestaurantCardProps } from "@/types";
import Link from "next/link";
import React from "react";

const RestaurantCard: React.FC<RestaurantCardProps> = ({ data }) => {
  console.log(data.phone);

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <Link
        href={{
          pathname: `/products/${data.phone}`,
          query: { data: JSON.stringify(data.phone) },
        }}
      >
        <img
          className="w-full h-64 object-cover object-center"
          src={data.logo}
          alt={data.name}
        />
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">{data.name}</h2>
          <p className="text-sm text-gray-600">{data.category}</p>
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;
