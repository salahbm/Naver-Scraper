import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import { getAllStores } from "@/lib/actions";
import Image from "next/image";

const Home = async () => {
  const restaurants = await getAllStores();
  console.log(`file: page.tsx:8 ~ restaurants:`, restaurants);
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Start getting the data from Naver:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>

            <h1 className="head-text">
              Unleash the Power of
              <span className="text-primary"> Naver Place</span>
            </h1>

            <SearchBar />
          </div>
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Searched Restaurants</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {restaurants ? (
            restaurants?.map((product, index) => (
              <RestaurantCard data={product} key={index} />
            ))
          ) : (
            <p className="text-center font-semibold text-lg text-neutral-700">
              You have not searched brands yet
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
