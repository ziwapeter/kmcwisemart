import Link from "next/link";
import React from "react";
import { ImageCard } from "./helpers/imageshome";
import { Metadata } from "next";
import { Allproductshome } from "./allproductshome";
import localFont from "@next/font/local";
import cutabove from "../../public/acutabove.svg";
import kmc from "../../public/kmc.svg";
import kmclogo from "../../public/kmcwisemart5.svg";
import Image from "next/image";
import halal from "../../public/halal.png"

const footlight = localFont({
  src: [
    {
      path: "../../public/fonts/footlight/FootlightMTProBold.otf",
      weight: "400",
    },
  ],
  variable: "--font-footlight",
});

export const metadata: Metadata = {
  title: "Kmcwisemart | A Cut Above The Best!",
  description:
    "KMCWiseMart: Kenya's innovative meat franchise, delivering the finest quality products. Powered by Kenya Meat Commission, blending tradition and modernity.",
  applicationName: "Kmcwisemart",
  openGraph: {
    title: "Kmcwisemart | A Cut Above The Best!",
    description:
      "KMCWiseMart: Kenya's innovative meat franchise, delivering the finest quality products. Powered by Kenya Meat Commission, blending tradition and modernity.",
    siteName: "Kmcwisemart",
    images: "https://kmcwisemart.co.ke/homepage3.jpg",
    url: "https://kmcwisemart.co.ke",
    type: "website",
  },
};

const images = [
  {
    src: "/beef_category.jpg",
    alt: "Delicious beef meat",
    category: "BEEF",
    title: "Beef Products",
  },
  {
    src: "/goat_category.jpg",
    alt: "Tender goat meat",
    category: "GOAT",
    title: "Goat Products",
  },
  {
    src: "/lamb_category.jpg",
    alt: "Fresh lamb meat",
    category: "LAMB",
    title: "Lamb Products",
  },
  {
    src: "/offals_category.jpg",
    alt: "Variety of offals",
    category: "OFFALS",
    title: "Offals",
  },
  {
    src: "/valueadd_category.jpg",
    alt: "Value added products",
    category: "VALUE ADDS",
    title: "Value Adds",
  },
  {
    src: "/byproducts_category.jpg",
    alt: "Different types of offals",
    category: "BY PRODUCTS",
    title: "By Products",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col grow max-w-screen-xl mx-auto p-2 sm:p-4 lg:p-6 items-center justify-center">
      <div className="rounded shadow-lg bg-black bg-opacity-20 p-2">
        <div className="rounded shadow-lg bg-white p-2">
        <div className="relative flex justify-center items-center">
        <Image  className="absolute top-[70%] left-[73%] sm:left-[65%] md:left-[63%] lg:left-[62%] transform -translate-x-10 -translate-y-20 z-0 w-28 opacity-30" src={halal} alt={"halal"} width={200} height={215} placeholder="blur" style={{objectFit: "contain"}} loading="lazy" blurDataURL="data:image/jpeg..." />
      <div className="mb-2 mt-6 z-10">  
        <div className="flex justify-center items-center py-2">
    <Image src={kmclogo} alt="A Cut Above The Best" className="w-48 sm:w-48 md:w-48 lg:w-60 drop-shadow-sm shadow-black" width={560} height={48} />
</div>
  <div className="flex justify-center items-center flex-row py-2">
    <div className="flex justify-end items-center me-1">
      <Image src={kmc} alt="A Cut Above The Best" className="w-9 sm:w-10 md:w-16 lg:w-16" width={150} height={146.97} />
    </div>
    <div className="flex justify-start items-center flex-col ms-1">
      <div className={`${footlight.className} text-[#312681] text-lg sm:text-lg md:text-2xl lg:text-3xl font-bold text-center drop-shadow-sm shadow-black`}>
        KENYA MEAT COMMISSION
      </div>
      <div className={`bg-[#312681] px-4 py-1 text-white text-[0.6rem] sm:text-[0.8rem] md:-[0.8rem] lg:text-xs text-center drop-shadow-sm shadow-black`}>
        ISO 222000: 2015 FSMS CERTIFIED
      </div>
    </div>
  </div>
  <div className="flex justify-center items-center">
    <div className={`${footlight.className} text-[#DC143C] text-lg sm:text-lg md:text-2xl lg:text-3xl font-bold text-center drop-shadow-sm shadow-black`}>
      KMC Nyama Haven
    </div>
  </div>
  <div className="flex justify-center items-center py-2">
    <Image src={cutabove} alt="A Cut Above The Best" className="w-40 sm:w-40 md:w-48 lg:w-56" width={500} height={81.83} />
  </div>
  <div className="flex justify-center items-center py-2">
    <Allproductshome />
  </div>
  </div>
 
  </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {images.map((image, i) => (
              <ImageCard
                key={i}
                src={image.src}
                alt={image.alt}
                cat={image.category}
                title={image.title}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
