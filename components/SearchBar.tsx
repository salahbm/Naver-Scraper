"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import React, { FormEvent, useState } from "react";

const isValidNaverProductUrl = (searchName: string): boolean => {
  try {
    // Extract the path from the searchName

    const words = searchName
      .split(" ")
      .filter((word: any) => word.trim() !== "");

    // Check if the number of words is more than 2
    const isValid = words.length >= 2;

    return isValid;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidLink = isValidNaverProductUrl(searchPrompt);
    if (!isValidLink)
      return alert(
        "Please provide Restaurant name and location, EX: '써브웨이 낙성대점'"
      );
    // Scrap the product
    try {
      setIsLoading(true);

      await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter Restaurant and Branch name"
        className="searchbar-input"
      />

      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
