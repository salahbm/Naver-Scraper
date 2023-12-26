"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import React, { FormEvent, useState } from "react";

const isValidNaverProductUrl = (url: string) => {
  try {
    const parseUrl = new URL(url);
    const hostName = parseUrl.hostname;
    // check if hostname contains Naver link
    if (
      hostName.includes("naver.com") ||
      hostName.includes("map.naver.") ||
      hostName.endsWith("naver")
    ) {
      return true;
    }
  } catch (error) {
    console.log(error);
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
        "This works with only Naver  links, Please provide valid link"
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
