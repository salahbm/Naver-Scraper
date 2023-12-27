import { redirect, useSearchParams } from "next/navigation";
import fetchLocalData from "@/lib/actions";

type Props = {
  params: { id: string };
};

const ProductDetails = () => {
  const getPhone = useSearchParams();
  const phone = getPhone.get("data");
  const product: any = fetchLocalData(phone);

  if (!product) redirect("/");

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        className="w-full h-64 object-cover object-center"
        src={product?.logo}
        alt={product?.name}
      />
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {product?.name}
        </h2>
        <p className="text-sm text-gray-600">{product?.category}</p>
        <p className="text-gray-700">{product?.address}</p>
        <p className="text-gray-700">{product?.phone}</p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Social Links:</h3>
          <ul>
            {product?.socialLinks.map((link: any, index: number) => (
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

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Menu:</h3>
          <ul>
            {product?.menu.map((item: any, index: number) => (
              <li key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800">{item.name}</p>
                  <p className="text-gray-600">{item.price}</p>
                </div>
                <img
                  className="w-16 h-16 object-cover"
                  src={item.imageUrl}
                  alt={item.name}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
