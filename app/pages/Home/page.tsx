"use client";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import { getAllStores } from "@/lib/actions";
import { RestaurantCardProps } from "@/types";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  _id: string;
  scrapeData: RestaurantCardProps;
  restaurants: { scrapeData: RestaurantCardProps }[];
}

const Home = () => {
  const { data: session } = useSession();
  const [stores, setStores] = useState<Props[]>([]);
  console.log(`file: page.tsx:19 ~ stores:`, stores);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        if (session?.user?.email) {
          const getStores = await getAllStores(session.user.email);
          console.log(getStores);
          setStores(getStores);
        } else {
          console.error("User email not available in the session.");
        }
      } catch (error: any) {
        console.error(`Failed to fetch stores: ${error.message}`);
      }
    };

    if (session?.user?.email) {
      fetchStores();
    }
  }, [session?.user?.email]);

  return (
    <>
      <section className="px-6 md:px-20 py-14">
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
        <h2 className="section-text">Searched Brands</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {stores.length > 0 ? (
            stores?.map((product, index) => (
              <RestaurantCard key={index} keyId={product._id} data={product.scrapeData} />
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
