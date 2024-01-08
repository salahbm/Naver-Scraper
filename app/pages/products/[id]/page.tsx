import { getStoreById } from "@/lib/actions";
import { RestaurantCardProps } from "@/types";

const ProductNotAvailableNotice = () => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-2xl font-semibold text-red-500">Product not available</p>
  </div>
);

interface pageProps {
  params: { id: string };
}
const ProductDetails = async ({ params }: pageProps) => {
  console.log(`file: page.tsx:14 ~ params:`, params.id);
  const temp = await getStoreById(params.id);
  const product: RestaurantCardProps = temp.scrapeData;
  console.log(`file: page.tsx:15 ~ product:`, product);

  return (
    <>
      {!product ? (
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
