"use client";
import React from "react";
import { Home, MapPin, Scan, Ticket, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/verify-register" || pathname === "/verify-forget-password") {
        return null;
    }
    return (
        <nav className=" fixed z-50 bottom-0 m-auto max-w-[800px] md:max-w-[400px] left-0 right-0 bg-[#C0FFDC] w-full">
            <div className="flex items-center p-4 gap-3 justify-between bg-[#C0FFDC] shadow-2xl shadow-black w-full">
                <div className="flex gap-12 items-center ">
                    <Link href={"/"} className="flex justify-center items-center gap-1 flex-col">
                        <Home size={32} />
                        <span className=" text-xs font-medium opacity-70">Home</span>
                    </Link>
                    <Link href={"/location"} className="flex justify-center gap-1 items-center flex-col">
                        <MapPin size={32} />
                        <span className=" text-xs font-medium opacity-70">Marketplace</span>
                    </Link>
                </div>
                <Link href={"/scan-waste"} className="flex absolute -translate-x-1/2 right-[36%] bottom-12 bg-green-700 text-white  p-4 rounded-full flex-col gap-3">
                    <Scan />
                </Link>
                <div className="flex gap-12 items-center">
                    <Link href={"/VoiceX"} className="flex justify-center gap-1 items-center flex-col">
                        <Image src={"/mic.png"} width={35} height={30} alt=""/>
                        <span className=" text-xs font-medium opacity-70">VoiceX</span>
                    </Link>
                    <Link href={"/bot"} className="flex justify gap-1 items-center flex-col">
                        <Image src={"/bot.png"} width={40} height={40} alt=""/>
                        <span className=" text-xs font-medium opacity-70">EcoBot</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
