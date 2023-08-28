"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import Link from "next/link";
interface Props {
  onClick: () => void;
}
interface TableData {
  [key: string]: any;
}
const whatsAppURL = `https://api.whatsapp.com/send?text=${encodeURIComponent("Have a Look at our products!")}%20${encodeURIComponent("https://kmcwisemart.co.ke")}`;
const TopBarNav: React.FC<Props> = ({onClick}) => {
  const {
    isScrolled,
    setIsScrolled,
    datatrue,
    setDatatrue 
  } = useMyCheckoutData();

  const storageData: any = typeof window !== "undefined" ? sessionStorage.getItem("newTabledata") : null;
  const storagefavourite: any = typeof window !== "undefined" ? sessionStorage.getItem("favouriteSelections") : null;
  const parsedStorageData: any = storageData ? JSON.parse(storageData) : null;
  const parsedFavouriteData: any = storagefavourite ? JSON.parse(storagefavourite) : null;
  
  const favouriteDataReturned: any = parsedFavouriteData ?? [];

  const [datahasloaded, setDatahasloaded] = useState<any>([])
  const storageDataReturned: any = useMemo(() => parsedStorageData ?? [], [parsedStorageData]);
 

 useEffect(() => {
    // Check if the data has been loaded before setting the loading state to false
    if (datatrue && storageDataReturned && storageDataReturned.length >=0) {
      setDatahasloaded(storageDataReturned);
      setDatatrue(false)
    }
   
    
  }, [storageDataReturned, datatrue, setDatatrue]);
  
  

 
  const topBarnavClassName = isScrolled
    ? "absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#3482F6] rounded-full shadow-md"
    : "absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#DC143C] rounded-full shadow-md";

  return (
    <nav className="flex items-center">
  
      <button className=" p-1 transition-colors duration-200 ease-in-out"
       onClick={datahasloaded && datahasloaded.length > 0 ? onClick : ()=>{}}>
        <span className="relative inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#FFFFFF"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          {(datahasloaded && datahasloaded.length > 0 )?
            <span className={topBarnavClassName}>
              {datahasloaded.length}
            </span>
            :
            <></>
          }
        </span>
      </button>

      <span className="inline-flex items-center border-l border-white mx-3 h-6"></span>
      <Link href={whatsAppURL} target="_blank" rel="noopener noreferrer">
      <button className=" p-1 transition-colors duration-200 ease-in-out"
        >
        <span className="relative inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#FFFFFF"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </span>
      </button>
      </Link>
    </nav>
  );
};

export default TopBarNav;
