"use client"
import React, { useEffect, useRef, useState } from "react";
import Allproducts from "../lib/allproducts";
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import { useRouter, useSearchParams, useParams} from 'next/navigation';
import Productswitcher from "../lib/productSearch";
export default function Products() {

  const {
    newMinOrder,
    setNewMinOrder,
    cachedTable,
    setCachedTable,
    search_item,
    setSearch_item,
    itemto_order,
    setItemto_order,
    desorasc,
    setDesorasc,
    ids_toupdate,
    setIds_toupdate,
    start_limit,
    setstart_limit,
    paginationsize,
    setPaginationsize,
    currentPage,
    setCurrentPage,
  } = useMyCheckoutData();
  // const searchParams = useSearchParams()
 
  // const title = searchParams.get('title')
  // const category = searchParams.get('category')
  const productMapping: Record<string, string> = {
    "BEEF": "Beef Products",
    "GOAT": "Goat Products",
    "LAMB": "Lamb Products",
    "OFFALS": "Offals",
    "BY PRODUCTS": "By Products",
    "VALUE ADDS": "Value Adds",
    "FAVOURITES": "Favourite Products",
  };
  

  const product: string = productMapping[search_item] || "All Products";

  
  return (
    <main className="flex flex-col grow max-w-screen-xl mx-auto p-2 sm:p-4 lg:p-6 items-center justify-center">
      <div className="rounded shadow-lg bg-black bg-opacity-20 p-2">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center pt-8 pb-8 text-2xl sm:text-2xl lg:text-2xl font-bold text-center text-white drop-shadow-lg shadow-black">
            <span>{product}</span>
          </div>

          <Productswitcher/>
        </div>

        <div className="rounded shadow-lg bg-white p-2">
          <Allproducts />
         
        </div>
      </div>
    </main>
  );
}


