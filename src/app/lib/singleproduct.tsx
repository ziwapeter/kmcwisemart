"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Productsearch from "@/app/lib/productSearch";
import Allproducts, { updateMinOrder } from "@/app/lib/allproducts";
import ProductSwitcher from "@/app/lib/productSwitcher";
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import styles from "../products/product.module.css";
import ProductTabs from "../helpers/productTabs";
import useSocialMediaShare from "./useSocialMediaShare";
import { usePathname , useRouter} from "next/navigation";
import Frequentproducts from "./frequentproducts";

interface Props {
  product: any;
  frequentproducts: any
  params: any;
}

const Singleproduct: FC<Props> = ({ product, params, frequentproducts }) => {
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

  const {
    shareOnFacebook,
    shareOnInstagram,
    shareOnWhatsApp,
    shareOnTwitter
  } = useSocialMediaShare();

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

  const [singleproduct, setSingleproduct] = useState<any>({});
  const [relatedproducts, setRelatedproducts] = useState<any>({});

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
    if (datatrue && product) {
      const updatedArrayC = updateMinOrder(storageDataReturned, [product]);
      setNewMinOrder(storageDataReturned);
      setSingleproduct(updatedArrayC[0]);
      //setChangingpopularitem(favouriteDataReturned);
      setDatatrue(false);
    }
  }, [
    product,
    setDatatrue,
    setNewMinOrder,
    datatrue,
    storageDataReturned,
    favouriteDataReturned,
  ]);

  const handleIncrement = async (productId: number) => {
    const updatedTableData = [singleproduct].map((product) =>
      product.products_id === productId
        ? {
            ...product,
            min_order: Math.min(product.min_order + 1, product.max_order),
          }
        : product
    );

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
    const updatedTableData = [singleproduct].map((product) =>
      product.products_id === productId
        ? { ...product, min_order: Math.max(product.min_order - 1, 0) }
        : product
    );

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

  return (
    <div className="rounded overflow-hidden shadow-lg bg-black bg-opacity-20 p-2">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center pt-8 pb-8 text-2xl sm:text-2xl lg:text-2xl font-bold text-center text-white drop-shadow-md shadow-black">
          <span>{singleproduct.products_name}</span>
        </div>
        <Productsearch />
      </div>
      <div className="rounded shadow-lg bg-white p-2">
        <ProductSwitcher />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="border border-gray-200 rounded shadow-sm">
            <Image
              className="w-full background-grey rounded"
              src={`/products/${singleproduct.image_url}`}
              alt={singleproduct.image_url || "kmcwisemart image"}
              width={1200}
              height={630}
            />
          </div>

          <div className="m-4">
            <div className="text-lg text-gray-900 font-bold">
              {singleproduct.products_name}
            </div>
            <div className="mt-2">
              <div className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-200 dark:text-gray-900 shadow-sm">
                {singleproduct.category_name}
              </div>
            </div>

            <div className="mt-2 pt-1 pb-2 flex justify-start items-center">
              <span className="inline-flex items-center">
                <sup>
                  <span
                    className={`${styles.textcrimson} mr-1 font-bold text-[0.6rem]`}
                  >
                    {process.env.currency}
                  </span>
                </sup>
                <span className={`${styles.textcrimson} font-bold text-md `}>
                  {addCommas(Number(singleproduct.products_price).toFixed(2))}
                </span>
              </span>

              <span className="inline-flex items-center border-l border-gray-200 mx-2 h-6"></span>

              <span className={`${styles.textcrimson} mr-1 font-bold text-md`}>
                {singleproduct.unit_name}
              </span>
            </div>
            <div className="mt-1">
              <div className="flex justify-start items-center">
                {singleproduct.min_order <= 0 ? (
                  <button
                    type="submit"
                    className="text-white self-center bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-700 me-2 shadow-md"
                    onClick={async () =>
                      await handleIncrement(singleproduct.products_id)
                    }
                  >
                    Add To Cart
                  </button>
                ) : (
                  <div className="rounded-full border border-gray-200 p-1 shadow-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <button
                          id={`decrement-${singleproduct.products_id}`}
                          className="text-white font-bold bg-[#DC143C] w-7 h-7 rounded-full mr-2 flex items-center justify-center"
                          onClick={async () =>
                            await handleDecrement(singleproduct.products_id)
                          }
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
                          {singleproduct.min_order}
                        </div>
                        <button
                          id={`increment-${singleproduct.products_id}`}
                          className="text-white font-bold bg-green-500 w-7 h-7 rounded-full ml-2 flex items-center justify-center"
                          onClick={() =>
                            handleIncrement(singleproduct.products_id)
                          }
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

              <div className="mt-4 flex justify-start flex-row">
                <button className="border border-gray-800 rounded-full px-2 py-2 me-2 hover:bg-gray-100 shadow-sm"
               >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#000"
                    version="1.1"
                    viewBox="0 0 52 52"
                    xmlSpace="preserve"
                  >
                    <path d="M26 0C11.663 0 0 11.663 0 26c0 4.891 1.359 9.639 3.937 13.762C2.91 43.36 1.055 50.166 1.035 50.237a.996.996 0 00.27.981c.263.253.643.343.989.237l10.306-3.17A25.936 25.936 0 0026 52c14.337 0 26-11.663 26-26S40.337 0 26 0zm0 50a23.94 23.94 0 01-12.731-3.651 1 1 0 00-.825-.108l-8.999 2.77a991.452 991.452 0 012.538-9.13c.08-.278.035-.578-.122-.821A23.907 23.907 0 012 26C2 12.767 12.767 2 26 2s24 10.767 24 24-10.767 24-24 24z"></path>
                    <path d="M42.985 32.126c-1.846-1.025-3.418-2.053-4.565-2.803-.876-.572-1.509-.985-1.973-1.218-1.297-.647-2.28-.19-2.654.188a1 1 0 00-.125.152c-1.347 2.021-3.106 3.954-3.621 4.058-.595-.093-3.38-1.676-6.148-3.981-2.826-2.355-4.604-4.61-4.865-6.146C20.847 20.51 21.5 19.336 21.5 18c0-1.377-3.212-7.126-3.793-7.707-.583-.582-1.896-.673-3.903-.273a1.01 1.01 0 00-.511.273c-.243.243-5.929 6.04-3.227 13.066 2.966 7.711 10.579 16.674 20.285 18.13 1.103.165 2.137.247 3.105.247 5.71 0 9.08-2.873 10.029-8.572a.996.996 0 00-.5-1.038zm-12.337 7.385c-10.264-1.539-16.729-11.708-18.715-16.87-1.97-5.12 1.663-9.685 2.575-10.717.742-.126 1.523-.179 1.849-.128.681.947 3.039 5.402 3.143 6.204 0 .525-.171 1.256-2.207 3.293A.996.996 0 0017 22c0 5.236 11.044 12.5 13 12.5 1.701 0 3.919-2.859 5.182-4.722a.949.949 0 01.371.116c.36.181.984.588 1.773 1.104 1.042.681 2.426 1.585 4.06 2.522-.742 3.57-2.816 7.181-10.738 5.991z"></path>
                  </svg>
                </button>

                <button className="border border-gray-800 rounded-full px-2 py-2 me-2 hover:bg-gray-100 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    version="1.1"
                    viewBox="0 0 40 40"
                    xmlSpace="preserve"
                  >
                    <path d="M21.93 35h-5.405a.736.736 0 01-.738-.738V21.926h-3.51a.74.74 0 01-.738-.737v-5.796a.74.74 0 01.738-.738h3.51v-1.519c0-4.41 3.322-8.136 7.255-8.136h4.684c.406 0 .737.331.737.738v5.794a.74.74 0 01-.737.738H23.05c-.086.021-.381.269-.381.814v1.569h5.057a.74.74 0 01.737.738v5.796a.739.739 0 01-.737.737h-5.057V34.26a.739.739 0 01-.739.74zm-4.667-1.477h3.929V21.188c0-.41.33-.738.738-.738h5.057v-4.32H21.93a.736.736 0 01-.738-.737v-2.308c0-1.37.956-2.291 1.85-2.291h3.945V6.477h-3.945c-3.079 0-5.778 3.112-5.778 6.659v2.257a.737.737 0 01-.738.737h-3.51v4.32h3.51c.408 0 .738.328.738.738v12.335z"></path>
                  </svg>
                </button>
                <button className="border border-gray-800 rounded-full px-2 py-2 me-2 hover:bg-gray-100 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="#000"
                      strokeLinejoin="round"
                      d="M3.062 7.245c.046-1.022.206-1.681.423-2.241l.003-.008c.214-.57.55-1.085.984-1.511l.006-.006.006-.006c.427-.435.943-.77 1.512-.984l.01-.004c.558-.217 1.216-.377 2.238-.423M3.062 7.245C3.012 8.337 3 8.675 3 11.506c0 2.832.012 3.17.062 4.262m0-8.523v.275m.427 10.497a4.18 4.18 0 00.984 1.511l.006.006.006.006c.426.434.942.77 1.511.985l.009.003c.559.217 1.217.376 2.24.423m-4.756-2.934l-.004-.01c-.217-.558-.377-1.216-.423-2.239m.427 2.249l-.013-.068m-.414-2.181l.016.088m-.016-.088v-.276m.414 2.457l-.398-2.093m.398 2.093c-.169-.446-.343-1.068-.398-2.093m.398 2.093l.018.046c.214.578.553 1.1.993 1.53.43.44.952.78 1.53.994.462.18 1.115.369 2.227.42 1.123.05 1.47.061 4.262.061 2.793 0 3.14-.01 4.262-.061 1.114-.052 1.766-.241 2.227-.42a4.166 4.166 0 001.53-.993c.44-.43.78-.953.994-1.53.18-.463.369-1.115.42-2.228.05-1.123.061-1.47.061-4.262 0-2.791-.01-3.14-.062-4.262-.05-1.12-.242-1.772-.422-2.234a4.159 4.159 0 00-.991-1.524 4.164 4.164 0 00-1.522-.99c-.463-.18-1.116-.37-2.235-.422a170.15 170.15 0 00-.276-.012M3.078 15.856a165.497 165.497 0 01-.017-.364m5.183-13.43C9.337 2.012 9.675 2 12.506 2c2.831 0 3.17.013 4.261.062m-8.523 0h.277m8.246 0h-.275m.275 0c1.023.046 1.682.206 2.242.423l.007.003c.57.214 1.085.55 1.512.984l.006.006.006.006c.434.427.77.942.984 1.512l.003.01c.218.558.377 1.216.424 2.239M8.52 2.062h7.971m-7.971 0c.924-.04 1.436-.05 3.985-.05 2.55 0 3.061.01 3.986.05m-7.971 0l-.277.012c-1.114.051-1.766.24-2.227.42a4.166 4.166 0 00-1.535.998c-.454.456-.751.912-.985 1.517-.182.464-.372 1.117-.423 2.235l-.012.276m18.889 8.248c-.047 1.023-.206 1.681-.423 2.24l-.003.008a4.187 4.187 0 01-.985 1.512l-.006.006-.006.006a4.18 4.18 0 01-1.511.984l-.01.004c-.558.217-1.216.376-2.239.423M3.062 15.49c-.04-.924-.05-1.435-.05-3.985s.01-3.06.05-3.986m0 7.972V7.52m7.754 8.068a4.418 4.418 0 103.381-8.164 4.418 4.418 0 00-3.381 8.164zM9.372 8.372a4.432 4.432 0 116.268 6.268 4.432 4.432 0 01-6.268-6.268zm10.062-2.33a1.269 1.269 0 11-2.538 0 1.269 1.269 0 012.538 0z"
                    ></path>
                  </svg>
                </button>
                <button className="border border-gray-800 rounded-full px-2 py-2 me-2 hover:bg-gray-100 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    version="1.1"
                    viewBox="0 0 40 40"
                    xmlSpace="preserve"
                  >
                    <path d="M14.533 33c-3.44 0-6.789-1.001-9.683-2.895a.788.788 0 01-.306-.918.763.763 0 01.807-.511 11.275 11.275 0 006.84-1.354C10.16 26.64 8.516 25 7.839 22.846a.792.792 0 01.155-.754.752.752 0 01.274-.2c-1.62-1.317-2.636-3.359-2.586-5.536a.779.779 0 01.383-.656.745.745 0 01.682-.039c-1.28-2.121-1.393-4.87-.092-7.145a.765.765 0 01.6-.385.757.757 0 01.65.284c2.74 3.429 6.698 5.614 10.974 6.086a7.013 7.013 0 011.458-4.872C21.638 7.957 23.582 7 25.672 7c1.725 0 3.398.679 4.656 1.876a11.291 11.291 0 003.209-1.317.743.743 0 01.863.062.789.789 0 01.251.848 7.043 7.043 0 01-.827 1.745c.203-.08.404-.165.602-.255a.753.753 0 01.895.21c.219.265.24.646.051.935a13.01 13.01 0 01-2.875 3.143c.098 4.83-1.786 9.77-5.086 13.292C24.063 31.11 19.61 33 14.533 33zm-6.19-2.793a16.102 16.102 0 006.19 1.236c5.875 0 9.645-2.709 11.773-4.982 3.113-3.321 4.853-8.018 4.651-12.562a.788.788 0 01.317-.668c.418-.306.813-.64 1.186-1-.364.079-.731.14-1.104.185a.765.765 0 01-.813-.521.79.79 0 01.33-.92 5.323 5.323 0 001.201-1.003c-.6.218-1.217.393-1.846.518a.75.75 0 01-.703-.228 5.254 5.254 0 00-3.855-1.705 5.22 5.22 0 00-4.139 2.039 5.452 5.452 0 00-1.01 4.582.789.789 0 01-.158.675.754.754 0 01-.624.28c-4.659-.239-9.05-2.337-12.223-5.805-.725 2.251.085 4.801 2.091 6.171a.787.787 0 01.303.884.758.758 0 01-.75.539 6.616 6.616 0 01-1.839-.319c.436 2.028 2.051 3.711 4.125 4.137.346.07.6.374.612.735s-.219.684-.561.779a6.826 6.826 0 01-1.707.245 5.28 5.28 0 004.438 2.618.764.764 0 01.709.53.79.79 0 01-.253.86 12.838 12.838 0 01-6.341 2.7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <ProductTabs product={product} />
        </div>
        <Frequentproducts   frequentproducts={frequentproducts} params={params}/>
      </div>
    </div>
  );
};

export default Singleproduct;
