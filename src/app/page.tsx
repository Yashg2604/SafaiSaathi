"use client";
import React, { useState } from "react";
import Image from "next/image";

import metal from "@/assets/aluminium.jpg";
import bottle from "@/assets/bottle.jpg";
import glass from "@/assets/glass.jpg";
import paper from "@/assets/paper.jpg";
import { CircleCheck, CircleX, X } from "lucide-react";

interface MaterialData {
  [key: string]: {
    merits: string;
    demerits: string;
  };
}

const materialData: MaterialData = {
  Plastic: {
    merits: "Plastic is versatile and lightweight.",
    demerits: "Plastic is non-biodegradable and contributes to pollution.",
  },
  Glass: {
    merits: "Glass is recyclable and does not degrade over time.",
    demerits: "Glass production requires a lot of energy.",
  },
  Paper: {
    merits: "Paper is biodegradable and recyclable.",
    demerits: "Paper production can lead to deforestation.",
  },
  Metal: {
    merits: "Metal is durable and can be recycled repeatedly.",
    demerits: "Metal extraction and processing can be energy-intensive.",
  },
};

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", flag: "🇧🇩" },
  { code: "pa", label: "Punjabi", flag: "🇮🇳" },
];

const translations: Record<
  string,
  { title: string; tagline: string; scan: string }
> = {
  en: {
    title: "Safai Saathi",
    tagline: "Har Bhasha Mein Safai Ki Pehchaan!",
    scan: "Scan. Sort. Sustain.",
  },
  hi: {
    title: "सफाई साथी",
    tagline: "हर भाषा में सफाई की पहचान!",
    scan: "स्कैन करें। अलग करें। बनाए रखें।",
  },
  ta: {
    title: "சுத்தம் தோழன்",
    tagline: "எல்லா மொழிகளிலும் சுத்தம் அடையாளம்!",
    scan: "ஸ்கேன். பிரி. நிலைநிறுத்து.",
  },
  bn: {
    title: "সাফাই সাথী",
    tagline: "প্রতিটি ভাষায় পরিচ্ছন্নতার পরিচয়!",
    scan: "স্ক্যান. আলাদা করুন. বজায় রাখুন।",
  },
  pa: {
    title: "ਸਫਾਈ ਸਾਥੀ",
    tagline: "ਹਰ ਭਾਸ਼ਾ ਵਿੱਚ ਸਫਾਈ ਦੀ ਪਛਾਣ!",
    scan: "ਸਕੈਨ ਕਰੋ। ਵੱਖਰਾ ਕਰੋ। ਬਰਕਰਾਰ ਰੱਖੋ।",
  },
};

const Page = () => {
  const [lang, setLang] = useState("en");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleMaterialClick = (material: string) => {
    setSelectedMaterial(material);
    setOpenModal(true);
  };

  const handleLanguageChange = (code: string) => {
    setLang(code);
    setDropdownOpen(false);
  };

  return (
    <section className="flex flex-col gap-3 pt-2 min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900">
      {/* Header */}
      <div className="h-[8vh] text-2xl font-extrabold flex justify-center items-center bg-green-600 text-white shadow-md tracking-wide relative">
        {translations[lang].title}

        {/* Language dropdown */}
        <div className="absolute top-2 right-3">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md hover:shadow-lg transition cursor-pointer text-sm"
            >
              <span>{languages.find((l) => l.code === lang)?.flag}</span>
              <span className="text-green-800 font-semibold">
                {languages.find((l) => l.code === lang)?.label}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl py-2 w-40 z-50 border border-green-200">
                {languages.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-green-800 rounded-lg hover:bg-green-100 text-sm transition ${
                      lang === l.code ? "bg-green-50 font-semibold" : ""
                    }`}
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 flex flex-col items-center text-center px-6 overflow-y-auto pb-[100px]">
        <Image
          width={200}
          height={200}
          src={"/safaisaathilogo2.png"}
          alt="logo"
          className="mt-4 mb-2"
        />
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-snug">
          {translations[lang].tagline}
        </h1>
        <p className="text-lg md:text-xl text-green-800 max-w-2xl mb-6">
          {translations[lang].scan}
        </p>

        {/* Materials Section */}
        <h2 className="text-2xl font-bold mb-4">Materials</h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <div
            onClick={() => handleMaterialClick("Plastic")}
            className="flex justify-center items-center flex-col gap-2 shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10 bg-white"
          >
            <Image src={bottle} alt="bottle" className="h-24 w-24" />
            <h1>Plastic</h1>
          </div>
          <div
            onClick={() => handleMaterialClick("Glass")}
            className="flex justify-center items-center flex-col gap-2 shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10 bg-white"
          >
            <Image src={glass} alt="glass" className="h-24 w-24" />
            <h1>Glass</h1>
          </div>
          <div
            onClick={() => handleMaterialClick("Paper")}
            className="flex justify-center items-center flex-col gap-2 shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10 bg-white"
          >
            <Image src={paper} alt="paper" className="h-24 w-24" />
            <h1>Paper</h1>
          </div>
          <div
            onClick={() => handleMaterialClick("Metal")}
            className="flex justify-center items-center flex-col gap-2 shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10 bg-white"
          >
            <Image src={metal} alt="metal" className="h-24 w-24" />
            <h1>Metal</h1>
          </div>
        </div>
      </div>

      {/* Material Info Modal */}
      <div
        className={`w-full min-h-screen bg-black/70 fixed top-0 left-0 right-0 z-50 ${
          openModal ? "scale-100" : "scale-0"
        } duration-200`}
      >
        <div className="flex justify-center items-center min-h-screen rounded-lg">
          <div className=" bg-white rounded-xl w-[90%] h-72 shadow-lg shadow-white/10 overflow-y-scroll ">
            <div className="flex justify-end items-end p-4">
              <X size={40} onClick={() => setOpenModal(!openModal)} />
            </div>
            {selectedMaterial && (
              <div className="p-4 flex flex-col gap-3">
                <h2 className="text-2xl font-semibold">{selectedMaterial}</h2>
                <p className="text-xl font-bold flex items-center gap-2">
                  <CircleCheck size={20} color="green" />
                  {materialData[selectedMaterial].merits}
                </p>
                <p className="text-xl font-bold flex items-center gap-2">
                  <CircleX color="red" size={20} />
                  {materialData[selectedMaterial].demerits}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
