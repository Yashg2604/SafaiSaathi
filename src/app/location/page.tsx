"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Lato } from "next/font/google";

const lato = Lato({ weight: "400", subsets: ["latin"] });

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("../../components/Map"), { ssr: false });

const GoogleMapsComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching vendors near:", searchQuery);
    alert(`Searching vendors near "${searchQuery}" (5-10 km radius)`);
  };

  return (
    <div
      className={`overflow-hidden ${lato.className} flex flex-col items-center p-6 bg-gradient-to-b from-green-50 to-green-100 min-h-screen`}
    >
      {/* Header Section */}
      <div className="text-center mt-4 mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800">
          Live Marketplace
        </h1>
        {/* Search Bar Section */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full md:w-999/1000 lg:w-999/1000 bg-white border-2 border-green-600 rounded-3xl shadow-lg overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search for vendors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-5 py-3 text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200"
        >
          Search
        </button>
      </form>
      </div>

      {/* Map Section */}
      <div className="w-full md:w-4/5 lg:w-3/4 mb-8">
        <div className="border-4 border-green-600 rounded-3xl overflow-hidden shadow-xl">
          {/* Reduced map height by 20% (now 55vh) */}
          <div className="h-[55vh]">
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsComponent;
