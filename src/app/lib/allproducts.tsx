"use client";
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import { useEffect, useMemo, useRef, useState } from "react";
import {QueryClient,useQuery,
} from "react-query";
import axios, { AxiosResponse } from "axios";
import ReactPaginate from "react-paginate";
import qs from "qs";
import React from "react";
import styles from "../products/product.module.css";
import Image from "next/image";
import Link from "next/link";
import ProductSearch from "./productSearch";
import ProductSwitcher from "./productSwitcher";

const slugify = require('slugify')

export interface QueryParams {
  start_limit: number;
  paginationsize: number;
  itemto_order: string;
  desorasc: string;
  search_item: string;
  ids_toupdate: number[];
}
 type CategoryType = {
    category: string;
    title: string;
    category2: string;
  }
export interface Product {
  products_id: number;
  products_name: string;
  product_description: string;
  products_price: string;
  unit_id: number;
  category_id: number;
  product_division: number;
  image_url: string;
  max_order: number;
  min_order: number;
  unit_name: string;
  category_name: string;
  category_description: string;
  numberOfProducts: number;
}

interface ProductResponse {
  allproducts: Product[];
  allproductslength: number;
}

interface AllproductsProps {
  dehydratedState?: unknown;
}
export function updateMinOrder(arrayA: Product[], arrayB: Product[]): Product[] {
  // Create a map of product IDs to min_order from arrayA
  const minOrderMap: { [key: number]: number } = {};
  arrayA.forEach((product) => {
    minOrderMap[product.products_id] = product.min_order;
  });

  // Update min_order in arrayB using the map
  return arrayB.map((product) => {
    if (minOrderMap[product.products_id] !== undefined) {
      return { ...product, min_order: minOrderMap[product.products_id] };
    } else {
      return product;
    }
  });
}
export const queryClientproducts = new QueryClient();
export default function Allproducts() {
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

  //hydrate(queryClientproducts, dehydratedState);

  return (
    <ProductsList
      searchParams={{
        start_limit,
        paginationsize,
        itemto_order,
        desorasc,
        search_item,
        ids_toupdate,
      }}
    />
  );
}

function ProductsList({ searchParams }: { searchParams: QueryParams }) {
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
 
  const previousDataKey = useMemo(
    () => [
      "products",
      currentPage * paginationsize,
      paginationsize,
      search_item,
      itemto_order,
      desorasc,
      ids_toupdate,
    ],
    [
      currentPage,
      paginationsize,
      search_item,
      itemto_order,
      desorasc,
      ids_toupdate,
    ]
  );
  const nextDataKey = useMemo(
    () => [
      "products",
      (currentPage + 1) * paginationsize,
      paginationsize,
      search_item,
      itemto_order,
      desorasc,
      ids_toupdate,
    ],
    [
      currentPage,
      paginationsize,
      search_item,
      itemto_order,
      desorasc,
      ids_toupdate,
    ]
  );
  const [changingpopularitems, setChangingpopularitem] = useState<any>([]);
  const storageDataReturned: any = useMemo(
    () => parsedStorageData ?? [],
    [parsedStorageData]
  );
  const favouriteDataReturned: any = useMemo(
    () => parsedFavouriteData ?? [],
    [parsedFavouriteData]
  );
  const { data, error, isRefetching, isSuccess } = useQuery<
    ProductResponse,
    Error
  >(previousDataKey, () => fetchProducts(searchParams), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const [pageCount, setPageCount] = useState<number>(0);

  const tablelength = useMemo(() => {
    if (data) {
      return data.allproductslength;
    }
    return 0;
  }, [data]);

  const tabledata = useMemo(() => {
    if (data) {
      return data.allproducts;
    }

    return [];
  }, [data]);

  useEffect(() => {
    if (data && tablelength > 0) {
      setPageCount(Math.ceil(tablelength / paginationsize));
    } else {
      setPageCount(0);
    }
    setDatatrue(true);
  }, [tablelength, data, paginationsize, setDatatrue]);

  // State for the current page

  useEffect(() => {
    if (datatrue && tabledata) {
      const updatedArrayC = updateMinOrder(storageDataReturned, tabledata);
      setNewMinOrder(storageDataReturned);
      setCachedTable(updatedArrayC);
      setChangingpopularitem(favouriteDataReturned);
      setDatatrue(false);
    }
  }, [
    tabledata,
    setCachedTable,
    setDatatrue,
    setNewMinOrder,
    datatrue,
    storageDataReturned,
    favouriteDataReturned,
  ]);

  useEffect(() => {
    if (data) {
      if ((currentPage + 1) * paginationsize < tablelength) {
        if (
          queryClientproducts.getQueryData(previousDataKey) &&
          !queryClientproducts.getQueryData(nextDataKey)
        ) {
          queryClientproducts.prefetchQuery(
            nextDataKey,
            () =>
              fetchProducts({
                ...searchParams,
                start_limit: (currentPage + 1) * paginationsize,
              }),
            {
              staleTime: Infinity,
              cacheTime: Infinity,
            }
          );
        }
      }
    }
  }, [
    data,
    currentPage,
    nextDataKey,
    paginationsize,
    previousDataKey,
    searchParams,
    tablelength,
  ]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * paginationsize) % tablelength;

    setCurrentPage(event.selected);
    setstart_limit(newOffset);
  };

 
 
  
  const categories: CategoryType[] = [
    { category: "Beef", title: "Beef Products", category2: "BEEF" },
    { category: "Goat", title: "Goat Products", category2: "GOAT" },
    { category: "Lamb", title: "Lamb Products", category2: "LAMB" },
    { category: "Offals", title: "Offals", category2: "OFFALS" },
    { category: "By Products", title: "By Products", category2: "BY PRODUCTS" },
    { category: "Value Adds", title: "Value Adds", category2: "VALUE ADDS" },
    { category: "Favourites", title: "Favourite Products", category2: "FAVOURITES" },
  ];
  const ref = useRef<HTMLDivElement>(null);



  const handleIncrement = async (productId: number) => {
    const updatedTableData = cachedTable.map((product) =>
      product.products_id === productId
        ? {
            ...product,
            min_order: Math.min(product.min_order + 1, product.max_order),
          }
        : product
    );

    setCachedTable(updatedTableData);

    const updatedProduct = updatedTableData.find(
      (product) => product.products_id === productId
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
    const updatedTableData = cachedTable.map((product) =>
      product.products_id === productId
        ? { ...product, min_order: Math.max(product.min_order - 1, 0) }
        : product
    );

    setCachedTable(updatedTableData);

    const updatedProduct = updatedTableData.find(
      (product) => product.products_id === productId
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
    numberOfProducts
  }) => (
    <>
  
        <div className=" relative rounded overflow-hidden shadow-sm m-auto border border-1 border-grey-100">
          
        <Link href={`/products/${slugify(category_name, { lower: true, remove: /[*+~.()'"!:@]/g })}/${slugify(products_name, { lower: true, remove: /[*+~.()'"!:@]/g })}/${products_id}`}>

          <Image
            className="w-full background-grey"
            src={`/products/${image_url}`}
            alt={image_url}
            width={600}
            height={315}
          />
          </Link>
          <div className="absolute top-2 right-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-200 dark:text-gray-900 shadow-sm">
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
                className="text-white self-center bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-700 me-2 shadow-sm"
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
   
      {data && (
       <ProductSwitcher/>
      )}
      <div className="flex flex-wrap justify-center">
        <>
          {error && (
            <div className={`${styles.textcrimson} font-medium m-20`}>
              An error has occurred: {error.message}
            </div>
          )}
          {(!data && !error) && (
            <div className="w-full">
              <div className=" relative rounded overflow-hidden shadow-sm m-auto border border-1 border-grey-100">
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

          {data?.allproducts.length === 0 && (
            <div className="w-full">
              <div className="max-w-sm relative rounded overflow-hidden shadow-lg m-auto border border-1 border-grey-100">
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
          {cachedTable.map((tabledatanow, i) => (
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
              numberOfProducts={cachedTable.length}
            />
          ))}
          </div>
        </>
      </div>
      {data ? (
        <>
          <div className="pagination-container flex justify-center mt-2">
            <div className="sm:hidden md:hidden lg:hidden">
              <ReactPaginate
                previousLabel={<span>&lt;</span>}
                nextLabel={<span>&gt;</span>}
                breakLabel="..."
                breakClassName="flex items-center justify-center px-2 py-1 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 shadow-sm rounded-md hover:bg-gray-200"
                pageCount={pageCount}
                marginPagesDisplayed={0}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                forcePage={pageCount > 0 ? currentPage : -1} // Prop to control the current page
                containerClassName="flex items-center"
                activeClassName={`${styles.backgroundblue} hover:${styles.backgroundblue} px-2 py-1 mx-1`}
                pageClassName="flex items-center justify-center px-2 py-1 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 shadow-sm rounded-md hover:bg-gray-200"
                pageLinkClassName="text-gray-500"
                previousClassName="flex items-center justify-center px-2 py-1 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 shadow-sm rounded-md"
                nextClassName="flex items-center justify-center px-2 py-1 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 shadow-sm rounded-md"
                previousLinkClassName="text-gray-500"
                nextLinkClassName="text-gray-500"
                activeLinkClassName={`${styles.textwhitenow}`} // Apply the white text color to the active page link
                disabledLinkClassName={`${styles.textcolornow} pointer-events-none`}
              />
            </div>
            <div className="hidden sm:block md:block lg:block">
              <ReactPaginate
                previousLabel={<span>&lt;</span>}
                nextLabel={<span>&gt;</span>}
                breakLabel="..."
                breakClassName="flex items-center justify-center px-2 py-1 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 shadow-sm rounded-md hover:bg-gray-200"
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                forcePage={pageCount > 0 ? currentPage : -1} // Prop to control the current page
                containerClassName="flex items-center"
                activeClassName={`${styles.backgroundblue} hover:${styles.backgroundblue} px-2 py-1 mx-1`}
                pageClassName="flex items-center justify-center px-2 py-1 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 shadow-sm rounded-md hover:bg-gray-200"
                pageLinkClassName="text-gray-500"
                previousClassName="flex items-center justify-center px-2 py-1 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 shadow-sm rounded-md"
                nextClassName="flex items-center justify-center px-2 py-1 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 shadow-sm rounded-md"
                previousLinkClassName="text-gray-500"
                nextLinkClassName="text-gray-500"
                activeLinkClassName={`${styles.textwhitenow}`} // Apply the white text color to the active page link
                disabledLinkClassName={`${styles.textcolornow} pointer-events-none`}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export const fetchProducts = async (
  queryParams: QueryParams
): Promise<ProductResponse> => {
  try {
    const { ids_toupdate, ...otherParams } = queryParams;
    const serializedParams = {
      ...otherParams,
      ids_toupdate: JSON.stringify(ids_toupdate),
    };

    const res: AxiosResponse<ProductResponse> = await axios.get(
      `${process.env.baseurl}/products`,
      {
        params: serializedParams,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "brackets" });
        },
      }
    );

    return res.data;
  } catch (err) {
    throw new Error("Fetching products failed");
  }
};
