import { getStoreById } from "@/lib/actions";
import { NaverKeywordData, RestaurantCardProps } from "@/types";

const ProductNotAvailableNotice = () => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-2xl font-semibold text-red-500">Product not available</p>
  </div>
);

interface pageProps {
  params: { id: string };
}
const ProductDetails = async ({ params }: pageProps) => {
  const temp: any | null = await getStoreById(params.id);
  const product: RestaurantCardProps = temp.scrapeData;

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
              <ul className="max-h-[350px] overflow-auto border rounded-md border-b ">
                {product?.reviews?.map((review: any, index: number) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-24"
                  >
                    <p className="text-neutral-600 font-thin">{review.type}</p>
                    <p className="text-neutral-600 font-semibold">
                      {review.count}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-500">
              Naver Keywords
            </h3>
            <div className="mt-2">
              <ul>
                {product.naverKeywords?.map((keyword, index) => (
                  <li key={index}>
                    <p className="text-green-600 font-bold text-lg text-center">
                      Keyword: {decodeURIComponent(keyword.relKeyword)}
                    </p>
                    <div className="flex items-center justify-between px-5">
                      <p className="text-gray-700 font-bold">
                        Monthly Mobile Qc Count:
                        <span className="text-neutral-600 font-semibold">
                          {keyword.monthlyMobileQcCnt}
                        </span>
                      </p>
                      <p className="text-gray-700 font-bold">
                        Monthly PC Qc Count:
                        <span className="text-neutral-600 font-semibold">
                          {keyword.monthlyPcQcCnt}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-5">
                      <p className="text-gray-700 font-bold">
                        Monthly Average Mobile Click Count:
                        <span className="text-neutral-600 font-semibold">
                          {keyword.monthlyAveMobileClkCnt}
                        </span>
                      </p>
                      <p className="text-gray-700 font-bold">
                        Monthly Average PC Click Count:
                        <span className="text-neutral-600 font-semibold">
                          {keyword.monthlyAvePcClkCnt}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-5">
                      <p className="text-gray-700 font-bold">
                        Monthly Average PC CTR:{" "}
                        <span className="text-neutral-600 font-semibold">
                          {" "}
                          {keyword.monthlyAvePcCtr}
                        </span>
                      </p>
                      <p className="text-gray-700 font-bold">
                        Monthly Average Mobile CTR:{" "}
                        <span className="text-neutral-600 font-semibold">
                          {keyword.monthlyAveMobileCtr}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-5">
                      <p className="text-gray-700 font-bold">
                        Comp Index:{" "}
                        <span className="text-neutral-600 font-semibold mx-2">
                          {keyword.compIdx}
                        </span>
                      </p>
                      <p className="text-gray-700 font-bold">
                        PL Avg Depth:
                        <span className="text-neutral-600 font-semibold">
                          {" "}
                          {keyword.plAvgDepth}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <h3
              className={`${
                product.trendingKeywords?.length === 0 && "hidden"
              } text-lg font-semibold mb-2 text-green-500`}
            >
              Trending Keywords
            </h3>
            <div className="mt-2">
              <ul className="flex items-center justify-start gap-3">
                {product.trendingKeywords?.map((keyword, index) => (
                  <li key={index}>
                    <p className="text-neutral-600 font-semibold border rounded-md p-2 m-1">
                      {keyword}
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
