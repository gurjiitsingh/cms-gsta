"use client";



import { UseSiteContext } from "@/SiteContext/SiteContext";
import { useEffect } from "react";


//import { usePathname } from "next/navigation";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Home() {
  const { bargerMenuToggle } = UseSiteContext();

  useEffect(() => {
   
    bargerMenuToggle(false);
  }, []);



  return (
    <div className="w-full mx-auto bg-gray-100 text-gray-900 ">
      {/* Header */}
   
    </div>
  );
}
