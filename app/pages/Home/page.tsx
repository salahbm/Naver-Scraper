'use client';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import { getAllStores, getRecentStores } from '@/lib/actions';
import { RestaurantCardProps } from '@/types';
import { useSession } from 'next-auth/react';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  _id: string;
  scrapeData: RestaurantCardProps;
  restaurants: { scrapeData: RestaurantCardProps }[];
}

const Home = () => {
  const { data: session } = useSession();
  const [stores, setStores] = useState<Props[]>([]);
  const [recentStores, setRecentStores] = useState<Props[]>([]);
  useEffect(() => {
    const fetchStores = async () => {
      try {
        if (session?.user?.email) {
          const getStoresData = await getAllStores(session.user.email);
          // Assuming getStoresData is an array of objects
          const getStores: Props[] = getStoresData.map((storeData: any) => ({
            _id: storeData._id,
            scrapeData: storeData.scrapeData,
            restaurants: storeData.restaurants || [],
          }));

          console.log(getStores);
          setStores(getStores);
        } else {
          console.error('User email not available in the session.');
        }
      } catch (error: any) {
        console.error(`Failed to fetch stores: ${error.message}`);
      }
    };
    if (session?.user?.email) {
      fetchStores();
    }
  }, [session?.user?.email]);
  useEffect(() => {
    const fetchRecentStores = async () => {
      const getRecentStoresData: any = await getRecentStores();

      if (getRecentStoresData) {
        setRecentStores(getRecentStoresData);
      }
    };
    fetchRecentStores();
  }, []);
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
        <h2 className="text-lg text-primary font-bold ">
          Brands<span className="text-neutral-600"> You Have Searched</span>
        </h2>

        <div className="flex flex-wrap gap-x-8 gap-y-1">
          {stores.length > 0 ? (
            stores?.map((product, index) => (
              <RestaurantCard
                key={index}
                keyId={product._id}
                data={product.scrapeData}
              />
            ))
          ) : (
            <p className="text-center font-semibold text-md text-orange-400">
              No stores found. Please search for a store to explore!
            </p>
          )}
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">Recent Searched Brands</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {recentStores.length > 0 &&
            recentStores?.map((product, index) => (
              <RestaurantCard
                key={index}
                keyId={product._id}
                data={product.scrapeData}
              />
            ))}
        </div>
      </section>
    </>
  );
};

export default Home;
