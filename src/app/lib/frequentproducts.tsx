"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Productsearch from "@/app/lib/productSearch";
import Allproducts, { Product, updateMinOrder } from "@/app/lib/allproducts";
import ProductSwitcher from "@/app/lib/productSwitcher";
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import styles from "../products/product.module.css";
import ProductTabs from "../helpers/productTabs";
import useSocialMediaShare from "./useSocialMediaShare";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
const slugify = require("slugify");
interface Props {
  frequentproducts: any;
  params: any;
}

const Frequentproducts: FC<Props> = ({ frequentproducts, params }) => {
  const pathname = usePathname();
  const router = useRouter();
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
    selectedOption,
    setSelectedOption,
    datatrue,
    setDatatrue,
  } = useMyCheckoutData();

  const storageData: any =
    typeof window !== "undefined"
      ? sessionStorage.getItem("newTabledata")
      : null;
  const storagefavourite: any =
    typeof window !== "undefined"
      ? sessionStorage.getItem("favouriteSelections")
      : null;
  const parsedStorageData: any = storageData ? JSON.parse(storageData) : null;
  const parsedFavouriteData: any = storagefavourite
    ? JSON.parse(storagefavourite)
    : null;

  const storageDataReturned: any = useMemo(
    () => parsedStorageData ?? [],
    [parsedStorageData]
  );
  const favouriteDataReturned: any = useMemo(
    () => parsedFavouriteData ?? [],
    [parsedFavouriteData]
  );


  const [relatedproducts, setRelatedproducts] = useState<any>([]);

  useEffect(() => {
    if (params.category_name) {
      setDatatrue(true);
      const formattedSearchItem = params.category_name
        .toLowerCase()
        .split(" ")
        .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setSelectedOption(formattedSearchItem);
    }
  }, [params.category_name]);

  useEffect(() => {
    if (datatrue && frequentproducts) {
      const updatedArrayC = updateMinOrder(storageDataReturned, frequentproducts);
      setNewMinOrder(storageDataReturned);
      setRelatedproducts(updatedArrayC);
      //setChangingpopularitem(favouriteDataReturned);
      setDatatrue(false);
    }
  }, [
    frequentproducts,
    setDatatrue,
    setNewMinOrder,
    datatrue,
    storageDataReturned,
    favouriteDataReturned,
  ]);
  const handleIncrement = async (productId: number) => {
    const updatedTableData = relatedproducts.map((product: any) =>
      product.products_id === productId
        ? {
            ...product,
            min_order: Math.min(product.min_order + 1, product.max_order),
          }
        : product
    );

    setCachedTable(updatedTableData);

    const updatedProduct = updatedTableData.find(
      (product: any) => product.products_id === productId
    );
    const existingProductIndex = newMinOrder.findIndex(
      (product) => product.products_id === productId
    );

    let newMinOrderCopy;

    if (existingProductIndex > -1) {
      newMinOrderCopy = [
        ...newMinOrder.slice(0, existingProductIndex),
        updatedProduct,
        ...newMinOrder.slice(existingProductIndex + 1),
      ];
    } else {
      newMinOrderCopy = [...newMinOrder, updatedProduct];
    }

    setNewMinOrder(newMinOrderCopy);
    sessionStorage.setItem("newTabledata", JSON.stringify(newMinOrderCopy));
    sessionStorage.setItem(
      "favouriteSelections",
      JSON.stringify([...favouriteDataReturned, updatedProduct])
    );

    setDatatrue(true);
  };

  const handleDecrement = async (productId: number) => {
    const updatedTableData = relatedproducts.map((product: any) =>
      product.products_id === productId
        ? { ...product, min_order: Math.max(product.min_order - 1, 0) }
        : product
    );

    setCachedTable(updatedTableData);

    const updatedProduct = updatedTableData.find(
      (product: any) => product.products_id === productId
    );
    const existingProductIndex = newMinOrder.findIndex(
      (product) => product.products_id === productId
    );

    let newMinOrderCopy: any = [];

    if (updatedProduct.min_order === 0) {
      if (existingProductIndex > -1) {
        newMinOrderCopy = [
          ...newMinOrder.slice(0, existingProductIndex),
          ...newMinOrder.slice(existingProductIndex + 1),
        ];
      }
    } else {
      if (existingProductIndex > -1) {
        newMinOrderCopy = [
          ...newMinOrder.slice(0, existingProductIndex),
          updatedProduct,
          ...newMinOrder.slice(existingProductIndex + 1),
        ];
      } else {
        newMinOrderCopy = [...newMinOrder, updatedProduct];
      }
    }

    setNewMinOrder(newMinOrderCopy);

    sessionStorage.setItem("newTabledata", JSON.stringify(newMinOrderCopy));
    sessionStorage.setItem(
      "favouriteSelections",
      JSON.stringify([...favouriteDataReturned, updatedProduct])
    );
    setDatatrue(true);
  };
  const Productswithimage: React.FC<Product> = ({
    products_id,
    products_name,
    product_description,
    products_price,
    unit_id,
    category_id,
    product_division,
    image_url,
    max_order,
    min_order,
    unit_name,
    category_name,
    category_description,
    numberOfProducts,
  }) => (
    <>
      <div className="max-w-sm relative rounded overflow-hidden shadow-sm m-auto border border-1 border-grey-100">
        <Link
          href={`/products/${slugify(category_name, {
            lower: true,
            remove: /[*+~.()'"!:@]/g,
          })}/${slugify(products_name, {
            lower: true,
            remove: /[*+~.()'"!:@]/g,
          })}/${products_id}`}
        >
          <Image
            className="w-full background-grey"
            src={`/products/${image_url}`}
            alt={image_url}
            width={600}
            height={315}
          />
        </Link>
        <div className="absolute top-2 right-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-200 dark:text-gray-900 shadow-md">
          {category_name}
        </div>

        <div className="pt-2 flex justify-center items-center">
          <div className="font-bold text-sm text-gray-900">
            <span className="block truncate ...">{products_name}</span>
          </div>
        </div>
        <div className="pt-1 pb-2 flex justify-center items-center">
          <span className="inline-flex items-center">
            <sup>
              <span
                className={`${styles.textcrimson} mr-1 font-bold text-[0.55rem]`}
              >
                {process.env.currency}
              </span>
            </sup>
            <span className={`${styles.textcrimson} font-bold text-sm `}>
              {addCommas(Number(products_price).toFixed(2))}
            </span>
          </span>

          <span className="inline-flex items-center border-l border-gray-200 mx-2 h-4"></span>

          <span className={`${styles.textcrimson} mr-1 font-bold text-sm`}>
            {unit_name}
          </span>
        </div>
        <div className="px-6 pb-5 flex justify-center items-center">
          {min_order <= 0 ? (
            <button
              type="submit"
              className="text-white self-center bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-700 me-2 shadow-md"
              onClick={async () => await handleIncrement(products_id)}
            >
              Add To Cart
            </button>
          ) : (
            <div className="rounded-full border border-gray-200 p-1 shadow-sm">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <button
                    id={`decrement-${products_id}`}
                    className="text-white font-bold bg-[#DC143C] w-7 h-7 rounded-full mr-2 flex items-center justify-center"
                    onClick={async () => await handleDecrement(products_id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="6"
                        y="11"
                        width="12"
                        height="2"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  <div
                    id="count"
                    className="text-gray-900 text-lg font-semibold w-6 text-center"
                  >
                    {min_order}
                  </div>
                  <button
                    id={`increment-${products_id}`}
                    className="text-white font-bold bg-green-500 w-7 h-7 rounded-full ml-2 flex items-center justify-center"
                    onClick={() => handleIncrement(products_id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="0.5"
                        x="11"
                        y="18"
                        width="12"
                        height="2"
                        rx="1"
                        transform="rotate(-90 11 18)"
                        fill="currentColor"
                      />
                      <rect
                        x="6"
                        y="11"
                        width="12"
                        height="2"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
    {frequentproducts.length === 0 ? <></>: <>
      <div className="mt-4">
        <div className="text-md font-semibold text-gray-900 mb-8 border-b border-gray-200 flex">
          <div className="inline-block p-4 border-b-2 rounded-t-lg border-blue-500">Related Products </div>
        </div>

        <div className="flex flex-wrap justify-center">
          <>
          
            {!frequentproducts && (
              <div className="w-full">
                <div className="max-w-sm relative rounded overflow-hidden shadow-sm m-auto border border-1 border-grey-100">
                  <div className="bg-slate-200 animate-pulse">
                  <div className="w-full h-[182.7px]"></div>
                  </div>

                  <div className="pt-2 flex justify-center items-center">
                    <div className="font-bold text-sm text-gray-900 bg-slate-200 animate-pulse rounded-full">
                      <span className="block truncate ... opacity-0">
                        {"OSSUBUCCO"}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 pb-2 flex justify-center items-center ">
                    <div className="bg-red-200 animate-pulse rounded-full">
                      <span className="inline-flex items-center">
                        <span
                          className={`${styles.textcrimson} font-bold text-sm opacity-0`}
                        >
                          {"200"}
                        </span>
                      </span>

                      <span className="inline-flex items-center border-l border-gray-200 mx-2 h-4 opacity-0"></span>

                      <span
                        className={`${styles.textcrimson} mr-1 font-bold text-sm opacity-0`}
                      >
                        {"KG"}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-5 flex justify-center items-center">
                    <div className="bg-blue-200 animate-pulse rounded-full">
                      <span className="opacity-0"> {"Add to cart"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {frequentproducts.length === 0 && (
              <div className="w-full">
                <div className="max-w-sm relative rounded overflow-hidden shadow-sm m-auto border border-1 border-grey-100">
                  <div className="bg-slate-200 animate-pulse">
                  <div className="w-full h-[182.7px]"></div>
                  </div>

                  <div className="pt-2 flex justify-center items-center">
                    <div className="font-bold text-sm text-gray-900 bg-slate-200 animate-pulse rounded-full">
                      <span className="block truncate ... opacity-0">
                        {"OSSUBUCCO"}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 pb-2 flex justify-center items-center ">
                    <div className="bg-red-200 animate-pulse rounded-full">
                      <span className="inline-flex items-center">
                        <span
                          className={`${styles.textcrimson} font-bold text-sm opacity-0`}
                        >
                          {"200"}
                        </span>
                      </span>

                      <span className="inline-flex items-center border-l border-gray-200 mx-2 h-4 opacity-0"></span>

                      <span
                        className={`${styles.textcrimson} mr-1 font-bold text-sm opacity-0`}
                      >
                        {"KG"}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-5 flex justify-center items-center">
                    <div className="bg-blue-200 animate-pulse rounded-full">
                      <span className="opacity-0"> {"Add to cart"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {relatedproducts.map((tabledatanow: any, i: any) => (
                <Productswithimage
                  key={i}
                  products_id={tabledatanow.products_id}
                  products_name={tabledatanow.products_name}
                  product_description={tabledatanow.product_description}
                  products_price={tabledatanow.products_price}
                  unit_id={tabledatanow.unit_id}
                  category_id={tabledatanow.category_id}
                  product_division={tabledatanow.product_division}
                  image_url={tabledatanow.image_url}
                  max_order={tabledatanow.max_order}
                  min_order={tabledatanow.min_order}
                  unit_name={tabledatanow.unit_name}
                  category_name={tabledatanow.category_name}
                  category_description={tabledatanow.category_description}
                  numberOfProducts={relatedproducts.length}
                />
              ))}
            </div>
          </>
        </div>
      
      </div>
      </>}
    </>
  );
};

export default Frequentproducts;
