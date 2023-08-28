"use client";
import Link from "next/link";
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
export const Allproductshome = () => {
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
  return (
    <>
   
      <Link
        href="/products"
        onClick={() => {
          setSearch_item("%");
        }}
        prefetch={false}
        
      >
        <button
          type="button"
          className={`text-white ${newMinOrder.length > 0 ? "bg-green-500 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-700"} focus:outline-none font-bold rounded-full text-lg px-6 py-2 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2`}
        >
          {newMinOrder.length > 0 ? "Continue Shopping!" : "Make Your Order!"}
        </button>
      </Link>
      
    </>
  );
};
