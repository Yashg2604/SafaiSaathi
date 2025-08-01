"use client";
import React, { useState } from "react";
import { Lato } from "next/font/google";
import CampusBot from "@/components/chatbot/CampusBot"; // Move chatbot component to components folder

const lato = Lato({ weight: "400", subsets: ["latin"] });

const Page = () => {
  const [language, setLanguage] = useState("en");

  return (
    <div className={`${lato.className} flex flex-col min-h-[90vh]`}>
      <h1 className="text-4xl font-bold tracking-wide mt-3 bg-[#C0FFDC] pl-2">EcoChat Bot</h1>

      {/* Language Selector */}
      <div className="mt-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="bn">বাংলা</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      {/* Chatbot */}
      <div className="bg-white rounded-3xl w-full flex-1 mt-8 p-4 shadow-lg">
        <CampusBot language={language} />
      </div>
    </div>
  );
};

export default Page;
