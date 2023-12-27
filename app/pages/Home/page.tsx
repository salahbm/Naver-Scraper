"use client";
import RestaurantCard from "@/components/RestaurantCard";
import ProductCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { useEffect, useState } from "react";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      try {
        const storedData = JSON.parse(
          localStorage.getItem("storedData") || "[]"
        );

        setRestaurants(storedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {restaurants?.map((product) => (
            <RestaurantCard data={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
