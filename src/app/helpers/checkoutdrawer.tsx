import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import { Product } from "../lib/allproducts";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { groupedOptions } from "./countiesTowns";
import Select, { components } from "react-select";
import { useWhatsAppMessage } from "./useWhatsAppMessage";
import { useSelectStyles } from "./useSelectStyles";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const capitalize = (s: string): string => {
  if (typeof s !== "string") return "";
  return s
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const initialValues = {
  location: "",
  name: "",
  mobile: "",
  estatehouseno: "",
  landmark: "",
  additionaldetails: "",
  transport: "",
  totalpayable: "",
  productstotal: 0,
};

const productSchema = Yup.object().shape({
  location: Yup.string().required("Your location is required"),
  name: Yup.string().required("Your name is required"),
  mobile: Yup.string()
    .required("Your phone number is required")
    .matches(/^(?:\+?[0-9] ?){6,14}[0-9]$/, "Invalid phone number format"),
});

const Drawer: FC<Props> = ({ isOpen, onClose }) => {
  const truncate = require("truncate");
  const ref: any = useRef(null);
  const selectRef = useRef<any | null>(null);
  const [loading, setLoading] = useState(false);
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

  const favouriteDataReturned: any = parsedFavouriteData ?? [];
  const [activeStep, setActiveStep] = useState<number>(0);

  const formik = useFormik({
    initialValues,
    validationSchema: productSchema,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        await sendWhatsAppMessage('+254703797444', values, newMinOrder);
        //await sendWhatsAppMessage("+254723456454", values, newMinOrder);
        resetForm();
      } catch (error) {
        console.error(error);
        // Handle your error here
      } finally {
        setLoading(false);
        setActiveStep(2);
      }
    },
  });

  function getSteps() {
    return ["Shopping Cart", "Delivery Details", "Order Submitted"];
  }
  const steps = getSteps();
  const [options, setOptions] = useState<any>(groupedOptions);
  const [selection, setSelection] = useState<any>([]);
  const [selectionValue, setSelectionValue] = useState<any>(null);
  const [placeholder, setPlaceholder] = useState<string>("Select County ...");
  const sendWhatsAppMessage = useWhatsAppMessage();
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

  const [datahasloaded, setDatahasloaded] = useState<any>([]);
  const storageDataReturned: any = useMemo(
    () => parsedStorageData ?? [],
    [parsedStorageData]
  );

  const onClosenow = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (newMinOrder.length === 0) {
      onClosenow();
    }
  }, [newMinOrder, onClosenow]);

  useEffect(() => {
    if (datatrue && storageDataReturned && storageDataReturned.length >= 0) {
      setNewMinOrder(storageDataReturned);
      setDatatrue(false);
    }
  }, [storageDataReturned, datatrue, setDatatrue, setNewMinOrder]);
  const selectStyles = useSelectStyles();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        // Check if activeStep is 2 and if the target is not within the ref container
        if(activeStep === 2 && ref.current && !ref.current.contains(event.target as Node)){
            setNewMinOrder([]);
            setSearch_item("%");
            setItemto_order("products_id");
            setDesorasc("ASC");
            sessionStorage.setItem("newTabledata", JSON.stringify([]));
            setSelection([]);
            setCurrentPage(0); 
            setstart_limit(0);
            setDatatrue(true);
            setActiveStep(0);
            onClose();
        }
        // If target is not within the ref container, call onClose
        else if(ref.current && !ref.current.contains(event.target as Node)) {
            onClose();
        }
    };
  
    // Add the listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        // Make sure to remove the listener when the component unmounts
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [onClose, activeStep, ref]); // Make sure to include all dependencies here

  

  const handleIncrement = async (productId: number) => {
    if (
      cachedTable.length > 0 &&
      cachedTable.some((product) => product.products_id === productId)
    ) {
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

      let newMinOrderCopy;

      const existingProductIndex = newMinOrder.findIndex(
        (product) => product.products_id === productId
      );

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
    } else {
      const newMinOrderCopy = newMinOrder.map((product) => ({
        ...product,
        min_order:
          product.products_id === productId
            ? Math.min(product.min_order + 1, product.max_order)
            : product.min_order,
      }));
      setNewMinOrder(newMinOrderCopy);
      sessionStorage.setItem("newTabledata", JSON.stringify(newMinOrderCopy));
      sessionStorage.setItem(
        "favouriteSelections",
        JSON.stringify([
          ...favouriteDataReturned,
          newMinOrderCopy.find((product) => product.products_id === productId),
        ])
      );
      setDatatrue(true);
    }
  };

  const handleDecrement = async (productId: number) => {
    if (
      cachedTable.length > 0 &&
      cachedTable.some((product) => product.products_id === productId)
    ) {
      const updatedTableData = cachedTable.map((product) =>
        product.products_id === productId
          ? { ...product, min_order: Math.max(product.min_order - 1, 0) }
          : product
      );

      setCachedTable(updatedTableData);

      const updatedProduct = updatedTableData.find(
        (product) => product.products_id === productId
      );

      let newMinOrderCopy: any = [];

      if (updatedProduct?.min_order === 0) {
        const existingProductIndex = newMinOrder.findIndex(
          (product) => product.products_id === productId
        );

        if (existingProductIndex > -1) {
          newMinOrderCopy = [
            ...newMinOrder.slice(0, existingProductIndex),
            ...newMinOrder.slice(existingProductIndex + 1),
          ];
        }
      } else {
        const existingProductIndex = newMinOrder.findIndex(
          (product) => product.products_id === productId
        );

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
    } else {
      const newMinOrderCopy = newMinOrder.map((product) => ({
        ...product,
        min_order:
          product.products_id === productId
            ? Math.max(product.min_order - 1, 0)
            : product.min_order,
      }));

      // Remove items with min_order of 0 from the array
      const filteredNewMinOrderCopy = newMinOrderCopy.filter(
        (product) => product.min_order > 0
      );

      setNewMinOrder(filteredNewMinOrderCopy);
      sessionStorage.setItem(
        "newTabledata",
        JSON.stringify(filteredNewMinOrderCopy)
      );

      // Find the product with the specific productId and add it to favouriteSelections
      const productToAddToFavorites = newMinOrderCopy.find(
        (product) => product.products_id === productId
      );
      sessionStorage.setItem(
        "favouriteSelections",
        JSON.stringify([...favouriteDataReturned, productToAddToFavorites])
      );
      setDatatrue(true);
    }
  };
  const handleDelete = async (productId: number) => {
    if (
      cachedTable.length > 0 &&
      cachedTable.some((product) => product.products_id === productId)
    ) {
      const updatedTableData = cachedTable.map((product) =>
        product.products_id === productId
          ? { ...product, min_order: 0 }
          : product
      );

      setCachedTable(updatedTableData);

      const newMinOrderCopy = newMinOrder.filter(
        (product) => product.products_id !== productId
      );
      setNewMinOrder(newMinOrderCopy);

      // Update sessionStorage for newTabledata with the filtered newMinOrderCopy
      sessionStorage.setItem("newTabledata", JSON.stringify(newMinOrderCopy));

      // Filter out the product with the specified productId from favouriteDataReturned
      const updatedFavorites = favouriteDataReturned.filter(
        (product: Product) => product.products_id !== productId
      );

      // Update sessionStorage for favouriteSelections with the updatedFavorites
      sessionStorage.setItem(
        "favouriteSelections",
        JSON.stringify(updatedFavorites)
      );
      setDatatrue(true);
    } else {
      // Filter out the product with the specified productId from newMinOrder
      const newMinOrderCopy = newMinOrder.filter(
        (product) => product.products_id !== productId
      );
      setNewMinOrder(newMinOrderCopy);

      // Update sessionStorage for newTabledata with the filtered newMinOrderCopy
      sessionStorage.setItem("newTabledata", JSON.stringify(newMinOrderCopy));

      // Filter out the product with the specified productId from favouriteDataReturned
      const updatedFavorites = favouriteDataReturned.filter(
        (product: Product) => product.products_id !== productId
      );

      // Update sessionStorage for favouriteSelections with the updatedFavorites
      sessionStorage.setItem(
        "favouriteSelections",
        JSON.stringify(updatedFavorites)
      );
      setDatatrue(true);
    }
  };

  const formatSelectedValue = () => {
    if (selectionValue) {
      let selectionList = [];
      if (selectionValue.county) {
        selectionList.push(selectionValue.county);
      }
      if (selectionValue.town) {
        selectionList.push(
          selectionValue.town +
            " (" +
            (selectionValue?.transport === "NEGOTIABLE"
              ? "NEGOTIABLE"
              : addCommas(Number(selectionValue?.transport).toFixed(2)) +
                " " +
                process.env.currency) +
            ")"
        );
      }

      return selectionList.join(", ");
    } else {
      return placeholder;
    }
  };

  const SingleValue = ({ children, ...props }: any) => (
    <components.SingleValue {...props}>
      {formatSelectedValue()}
    </components.SingleValue>
  );

  useEffect(() => {
    if (selectionValue?.town) {
      formik.setFieldValue(
        "productstotal",
        newMinOrder.reduce((sum: any, item: any) => {
          return sum + item.products_price * item.min_order;
        }, 0)
      );
      formik.setFieldValue(
        "totalpayable",
        selectionValue?.transport === "NEGOTIABLE"
          ? newMinOrder.reduce((sum: any, item: any) => {
              return sum + item.products_price * item.min_order;
            }, 0) + ` (Transport to be Negotiated)`
          : Number(selectionValue?.transport) +
              newMinOrder.reduce((sum: any, item: any) => {
                return sum + item.products_price * item.min_order;
              }, 0)
      );
      formik.setFieldValue(
        "transport",
        selectionValue?.transport === "NEGOTIABLE"
          ? "NEGOTIABLE"
          : selectionValue?.transport
      );
      formik.setFieldValue(
        "location",
        `${selectionValue?.county}, ${selectionValue?.town}`
      );
    }
  }, [selectionValue]);

  const handleChange = (option: any) => {
    setSelection(option);

    if (option) {
      setSelectionValue(option.value);

      if (option.value) {
        setOptions(groupedOptions);

        formik.setFieldValue("location", option ? formatSelectedValue() : "");

        formik.setFieldValue(
          "productstotal",
          option
            ? newMinOrder.reduce((sum: any, item: any) => {
                return sum + item.products_price * item.min_order;
              }, 0)
            : 0
        );
        formik.setFieldValue(
          "totalpayable",
          option
            ? selectionValue?.transport === "NEGOTIABLE"
              ? newMinOrder.reduce((sum: any, item: any) => {
                  return sum + item.products_price * item.min_order;
                }, 0) + ` (Transport to be Negotiated)`
              : Number(selectionValue?.transport) +
                newMinOrder.reduce((sum: any, item: any) => {
                  return sum + item.products_price * item.min_order;
                }, 0)
            : "NOT AVAILABLE"
        );
        formik.setFieldValue(
          "transport",
          option
            ? selectionValue?.transport === "NEGOTIABLE"
              ? "NEGOTIABLE"
              : selectionValue?.transport
            : "NOT AVAILABLE"
        );
      }
    } else {
      formik.setFieldValue("location", null);
      setSelectionValue(null);
      setOptions(groupedOptions); // Reset options to the top level
      setPlaceholder("Select County ..."); // Reset the placeholder
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleIsClearable = () => {
    return null;
  };
  const GetStepContent = (stepIndex: any) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            {isOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
              ></div>
            )}
            <div
              ref={ref}
              className={`fixed right-0 top-0 h-full w-7/8 sm:w-3/4 md:w-1/2 lg:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
                isOpen ? "translate-x-0" : "translate-x-full"
              } flex flex-col`}
            >
              <div className="fixed top-0 z-50 max-w-screen-xl mx-auto flex justify-between items-center px-6 py-5 border border-b-1 bg-white w-full">
                <div className="flex items-center text-lg font-bold text-gray-900">
                  {steps[0]}
                </div>

                <nav className="flex items-center">
                  <button
                    className=" p-1 transition-colors duration-200 ease-in-out"
                    onClick={onClose}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M6 19.7C5.7 19.7 5.5 19.6 5.3 19.4C4.9 19 4.9 18.4 5.3 18L18 5.3C18.4 4.9 19 4.9 19.4 5.3C19.8 5.7 19.8 6.29999 19.4 6.69999L6.7 19.4C6.5 19.6 6.3 19.7 6 19.7Z"
                        fill="currentColor"
                      />
                      <path
                        d="M18.8 19.7C18.5 19.7 18.3 19.6 18.1 19.4L5.40001 6.69999C5.00001 6.29999 5.00001 5.7 5.40001 5.3C5.80001 4.9 6.40001 4.9 6.80001 5.3L19.5 18C19.9 18.4 19.9 19 19.5 19.4C19.3 19.6 19 19.7 18.8 19.7Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
              <div className="overflow-auto p-0 m-0 flex-grow custom-height">
                <div className="mt-6 flex flex-col grow max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 items-center justify-center">
                  <div className="flex flex-col items-center w-full overflow-y-auto">
                    <div className="relative overflow-x-auto  w-full rounded-md">
                      <table className="w-full text-md text-left text-gray-500 whitespace-nowrap truncate ...">
                        <thead className="text-sm text-gray-900 bg-gray-100">
                          <tr>
                            <th scope="col" className="px-4 py-2">
                              Product
                            </th>
                            <th scope="col" className="px-4 py-2">
                              <div className="text-right">Quantity</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {newMinOrder &&
                            newMinOrder.length > 0 &&
                            newMinOrder.map(
                              (product: Product, index: number) => {
                                const isLastItem =
                                  index === newMinOrder.length - 1;
                                const shouldAddBorder =
                                  newMinOrder.length > 1 && !isLastItem;
                                return (
                                  <tr
                                    key={index}
                                    className={`bg-gray-50 ${
                                      shouldAddBorder ? "border-b" : ""
                                    }`}
                                  >
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                      <span className="sm:hidden md:hidden lg:hidden">
                                        <span className="font-bold">
                                          {" "}
                                          {truncate(product.products_name, 16)}
                                        </span>
                                        <div className="pt-1 pb-1 flex">
                                          <span className="inline-flex items-center">
                                            <sup>
                                              <span
                                                className={`mr-1 font-bold text-[0.55rem] text-[#DC143C]`}
                                              >
                                                {process.env.currency}
                                              </span>
                                            </sup>
                                            <span
                                              className={`font-bold text-sm text-[#DC143C]`}
                                            >
                                              {addCommas(
                                                Number(
                                                  product.products_price
                                                ).toFixed(2)
                                              )}
                                            </span>
                                          </span>

                                          <span className="inline-flex items-center border-l border-gray-200 mx-2 h-4"></span>

                                          <span
                                            className={`mr-1 font-bold text-sm text-[#DC143C]`}
                                          >
                                            {product.unit_name}
                                          </span>
                                        </div>
                                        <div className=" bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-200 dark:text-gray-900 shadow-sm inline-flex">
                                          {product.category_name}
                                        </div>
                                      </span>
                                      <span className="hidden sm:block md:block lg:block ">
                                        <span className="font-bold">
                                          {product.products_name}
                                        </span>
                                        <div className="pt-1 pb-1 flex">
                                          <span className="inline-flex items-center">
                                            <sup>
                                              <span
                                                className={`mr-1 font-bold text-[0.55rem] text-[#DC143C]`}
                                              >
                                                {process.env.currency}
                                              </span>
                                            </sup>
                                            <span
                                              className={`font-bold text-sm text-[#DC143C]`}
                                            >
                                              {addCommas(
                                                Number(
                                                  product.products_price
                                                ).toFixed(2)
                                              )}
                                            </span>
                                          </span>

                                          <span className="inline-flex items-center border-l border-gray-200 mx-2 h-4"></span>

                                          <span
                                            className={`mr-1 font-bold text-sm text-[#DC143C]`}
                                          >
                                            {product.unit_name}
                                          </span>
                                        </div>

                                        <div className=" bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-200 dark:text-gray-900 shadow-sm inline-flex">
                                          {product.category_name}
                                        </div>
                                      </span>
                                    </td>

                                    {/* Move the <div> outside of <td> */}
                                    <td className="px-4 py-2 flex justify-end items-center">
                                      <div className="rounded-full border border-gray-200 p-1 shadow-sm">
                                        <div className="text-right">
                                          <div className="flex items-center justify-start">
                                            <button
                                              id={`decrement-${product.products_id}`}
                                              className="text-white font-bold bg-[#DC143C] w-7 h-7 rounded-full mr-2 flex items-center justify-center"
                                              onClick={async () =>
                                                await handleDecrement(
                                                  product.products_id
                                                )
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
                                              {product.min_order}
                                            </div>
                                            <button
                                              id={`increment-${product.products_id}`}
                                              className="text-white font-bold bg-green-500 w-7 h-7 rounded-full ml-2 flex items-center justify-center"
                                              onClick={async () =>
                                                await handleIncrement(
                                                  product.products_id
                                                )
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

                                      <button
                                        className="ml-2 flex items-start justify-normal"
                                        onClick={() =>
                                          handleDelete(product.products_id)
                                        }
                                      >
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="#DC143C"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                                            fill="#DC143C"
                                          />
                                          <path
                                            opacity="0.5"
                                            d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z"
                                            fill="#DC143C"
                                          />
                                          <path
                                            opacity="0.5"
                                            d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z"
                                            fill="#DC143C"
                                          />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          {/* Add more rows as needed */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col grow max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 items-center justify-center rounded-md">
                  <table className="w-full text-md text-left text-gray-500 whitespace-nowrap truncate ... rounded-md shadow-sm">
                    <thead className="text-sm"></thead>
                    <tbody>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 text-sm font-bold text-gray-900"></td>
                        <td className="px-4 py-2 text-md font-bold text-gray-900  text-right">
                          Summary
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-2 py-2 text-sm font-bold text-gray-900 text-right">
                          Sub Total:
                        </td>
                        <td className="px-2 py-2 text-right">
                          <span className="inline-flex items-center">
                            <span className="text-sm font-bold text-[#FFF000]">
                              <span className="inline-flex items-center">
                                <sup>
                                  <span className="text-gray-900 mr-1 font-bold text-[0.55rem]">
                                    {process.env.currency}
                                  </span>
                                </sup>
                                <span className="text-md font-bold text-gray-900">
                                  {" "}
                                  {addCommas(
                                    newMinOrder
                                      .reduce((sum: any, item: any) => {
                                        return (
                                          sum +
                                          item.products_price * item.min_order
                                        );
                                      }, 0)
                                      .toFixed(2)
                                  )}
                                </span>
                              </span>
                            </span>
                          </span>
                        </td>
                      </tr>

                      <tr className="bg-gray-50">
                        <td className="px-2 py-2 text-sm font-bold text-gray-900 text-right">
                          Product Discount:
                        </td>
                        <td className="px-2 py-2   text-right">
                          <span className="inline-flex items-center">
                            <span className="text-sm font-bold">
                              <span className="inline-flex items-center">
                                <sup>
                                  <span className="text-gray-900 mr-1 font-bold text-[0.55rem]">
                                    {process.env.currency}
                                  </span>
                                </sup>
                                <span className="text-md font-bold text-gray-900">
                                  {addCommas((0).toFixed(2))}
                                </span>
                              </span>
                            </span>
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-2 py-2 text-sm font-bold text-gray-900  text-right">
                          Quantity:
                        </td>
                        <td className="px-2 py-2 text-right">
                          <span className="inline-flex items-center">
                            <span className="text-sm font-bold text-gray-900">
                              {addCommas(newMinOrder.length)}{" "}
                              {newMinOrder.length !== 1 ? "ITEMS" : "ITEM"}
                            </span>
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-gray-100 border-t">
                        <td className="px-4 py-4 text-md font-bold text-gray-900  text-right">
                          Total:
                        </td>
                        <td className="px-4 py-4  text-right">
                          <span className="inline-flex items-center">
                            <sup>
                              <span className=" mr-1 font-bold text-[0.55rem] text-[#DC143C]">
                                {process.env.currency}
                              </span>
                            </sup>
                            <span className="text-md font-bold  text-[#DC143C]">
                              {" "}
                              {addCommas(
                                newMinOrder
                                  .reduce((sum: any, item: any) => {
                                    return (
                                      sum + item.products_price * item.min_order
                                    );
                                  }, 0)
                                  .toFixed(2)
                              )}
                            </span>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="max-w-screen-xl mx-auto px-2 sm:px-6 md:px-6 lg:px-8 flex flex-row justify-end mt-4 mb-2">
                  <Link href="/products">
                    <button
                      className="text-white self-center bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-full text-sm px-4 py-2 inline-flex items-center shadow-md"
                      onClick={handleNext}
                    >
                      Checkout
                    </button>
                  </Link>
                </div>
                <div className="max-w-screen-xl mx-auto px-2 sm:px-6 md:px-6 lg:px-8 flex flex-row justify-end mb-4">
                  <Link href="/products">
                    <span className="inline-flex items-center">
                      <span className="text-[0.8rem]" onClick={onClose}>
                        or{" "}
                        <span className="text-blue-700">Continue Shopping</span>{" "}
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.6343 12.5657L8.45001 16.75C8.0358 17.1642 8.0358 17.8358 8.45001 18.25C8.86423 18.6642 9.5358 18.6642 9.95001 18.25L15.4929 12.7071C15.8834 12.3166 15.8834 11.6834 15.4929 11.2929L9.95001 5.75C9.5358 5.33579 8.86423 5.33579 8.45001 5.75C8.0358 6.16421 8.0358 6.83579 8.45001 7.25L12.6343 11.4343C12.9467 11.7467 12.9467 12.2533 12.6343 12.5657Z"
                          fill="#2b6cb0"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            {isOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
              ></div>
            )}
            <div
              ref={ref}
              className={`fixed right-0 top-0 h-full w-7/8 sm:w-3/4 md:w-1/2 lg:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
                isOpen ? "translate-x-0" : "translate-x-full"
              } flex flex-col`}
            >
              <div className="fixed top-0 z-50 max-w-screen-xl mx-auto flex justify-between items-center px-6 py-5 border border-b-1 bg-white w-full">
                <div className="flex items-center text-lg font-bold text-gray-900">
                  {steps[1]}
                </div>

                <nav className="flex items-center">
                  <button
                    className=" p-1 transition-colors duration-200 ease-in-out"
                    onClick={onClose}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M6 19.7C5.7 19.7 5.5 19.6 5.3 19.4C4.9 19 4.9 18.4 5.3 18L18 5.3C18.4 4.9 19 4.9 19.4 5.3C19.8 5.7 19.8 6.29999 19.4 6.69999L6.7 19.4C6.5 19.6 6.3 19.7 6 19.7Z"
                        fill="currentColor"
                      />
                      <path
                        d="M18.8 19.7C18.5 19.7 18.3 19.6 18.1 19.4L5.40001 6.69999C5.00001 6.29999 5.00001 5.7 5.40001 5.3C5.80001 4.9 6.40001 4.9 6.80001 5.3L19.5 18C19.9 18.4 19.9 19 19.5 19.4C19.3 19.6 19 19.7 18.8 19.7Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
              <div className="overflow-auto p-0 m-0 flex-grow custom-height">
                <div className="mt-6 flex flex-col grow max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 items-center justify-center">
                  <div className="flex flex-col items-center w-full overflow-y-auto">
                    <div className="relative overflow-x-auto  w-full rounded-md text-gray-500 bg-gray-50"></div>
                  </div>
                </div>

                <div className="flex flex-col grow max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 items-center justify-center rounded-md">
                  <form
                    id="kt_modal_checkoutallitems"
                    onSubmit={formik.handleSubmit}
                    className="form w-full"
                    noValidate
                  >
                    <div className="flex flex-wrap">
                      <div className="w-full md:w-1/2 xl:w-1/2 px-1 py-1">
                        <label className="block text-sm font-bold mb-2">
                          Name
                        </label>
                        <input
                          placeholder="Your Name"
                          type="text"
                          autoComplete="off"
                          {...formik.getFieldProps("name")}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            formik.setFieldValue(
                              "name",
                              capitalize(e.target.value)
                            );
                          }}
                          className={`placeholder-gray-300 text-md bg-gray-50 border border-gray-300 rounded w-full py-2 px-4 text-gray-900 focus:bg-white focus:border-blue-500`}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="text-red-500 text-xs pt-1 pb-1">
                            {formik.errors.name}
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 xl:w-1/2 px-1 py-1">
                        <label className="block text-sm font-bold mb-2">
                          Location
                        </label>
                       <Select
                          ref={selectRef}
                          styles={selectStyles}
                          escapeClearsValue
                          backspaceRemovesValue
                          placeholder={placeholder}
                          onBlur={formik.handleBlur("location")}
                          value={selection}
                          options={options}
                          onChange={(x: any) => handleChange(x)}
                          components={{ SingleValue }}
                         
                        />
                        {formik.touched.location && formik.errors.location && (
                          <div className="text-red-500 text-xs pt-1 pb-1">
                            {formik.errors.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap">
                      <div className="w-full md:w-1/2 xl:w-1/2 px-1 py-1">
                        <label className="block text-sm font-bold mb-2">
                          Mobile Number
                        </label>
                        <input
                          placeholder="0723456454"
                          type="text"
                          autoComplete="off"
                          {...formik.getFieldProps("mobile")}
                          className={`placeholder-gray-300 bg-gray-50 appearance-none border border-gray-300 rounded w-full py-2 px-4 text-gray-900 leading-tight  focus:bg-white focus:border-blue-500`}
                        />
                        {formik.touched.mobile && formik.errors.mobile && (
                          <div className="text-red-500 text-xs pt-1 pb-1">
                            {formik.errors.mobile}
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 xl:w-1/2 px-1 py-1">
                        <label className="block text-sm font-bold mb-2">
                          Estate, House Number (optional)
                        </label>
                        <input
                          placeholder="HOUSE NO. 10"
                          type="text"
                          {...formik.getFieldProps("estatehouseno")}
                          className={`placeholder-gray-300 bg-gray-50 appearance-none border border-gray-300 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:bg-white focus:border-blue-500`}
                        />
                        {formik.touched.estatehouseno &&
                          formik.errors.estatehouseno && (
                            <div className="text-red-500 text-xs pt-1 pb-1">
                              {formik.errors.estatehouseno}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-wrap">
                      <div className="w-full md:w-1/2 xl:w-1/2 px-1 py-1">
                        <label className="block text-sm font-bold mb-2">
                          Landmark (optional)
                        </label>
                        <input
                          placeholder="Near Garage, Near Building, Near School"
                          type="text"
                          autoComplete="off"
                          {...formik.getFieldProps("landmark")}
                          className={`placeholder-gray-300 bg-gray-50 appearance-none border border-gray-300 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:bg-white focus:border-blue-500`}
                        />
                        {formik.touched.landmark && formik.errors.landmark && (
                          <div className="text-red-500 text-xs pt-1 pb-1">
                            {formik.errors.landmark}
                          </div>
                        )}
                      </div>

                      <div className="w-full md:w-1/2 xl:w-1/2 px-1 py-1">
                        <label className="block text-sm font-bold mb-2">
                          Delivery Instructions (optional)
                        </label>
                        <input
                          placeholder="Please give the items to my employee of id 234567899"
                          type="text"
                          autoComplete="off"
                          {...formik.getFieldProps("additionaldetails")}
                          className={`placeholder-gray-300 bg-gray-50 appearance-none border border-gray-300 rounded w-full py-2 px-4 text-gray-900 leading-tight  focus:bg-white focus:border-blue-500`}
                        />
                        {formik.touched.additionaldetails &&
                          formik.errors.additionaldetails && (
                            <div className="text-red-500 text-xs pt-1 pb-1">
                              {formik.errors.additionaldetails}
                            </div>
                          )}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="max-w-screen-xl mx-auto px-2 sm:px-6 md:px-6 lg:px-8 flex flex-row justify-between mt-4 mb-2">
                  <button
                    type="button"
                    className="text-white self-center bg-gray-500 hover:bg-gray-700 focus:outline-none font-medium rounded-full text-sm px-4 py-2 inline-flex items-center shadow-md"
                    onClick={handleBack}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    form="kt_modal_checkoutallitems"
                    className="text-white self-center bg-green-500 hover:bg-green-700 focus:outline-none font-medium rounded-full text-sm px-4 py-2 inline-flex items-center shadow-md"
                    disabled={
                      formik.isSubmitting || !formik.isValid || !formik.dirty
                    }
                  >
                    {!loading && <span>Send Order</span>}
                    {loading && (
                      <span className="inline-flex items-center">
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                          />
                        </svg>{" "}
                        Please wait...
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            {isOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
              ></div>
            )}
            <div
              ref={ref}
              className={`fixed right-0 top-0 h-full w-7/8 sm:w-3/4 md:w-1/2 lg:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
                isOpen ? "translate-x-0" : "translate-x-full"
              } flex flex-col`}
            >
              <div className="fixed top-0 z-50 max-w-screen-xl mx-auto flex justify-between items-center px-6 py-5 border border-b-1 bg-white w-full">
                <div className="flex items-center text-lg font-bold text-gray-900">
                  {steps[2]}
                </div>

                <nav className="flex items-center">
                  <button
                    className=" p-1 transition-colors duration-200 ease-in-out"
                    onClick={()=>{
                      setNewMinOrder([]);
                      setSearch_item("%");
                      setItemto_order("products_id");
                      setDesorasc("ASC");
                      sessionStorage.setItem(
                        "newTabledata",
                        JSON.stringify([])
                      );
                      setSelection([]);
                      setCurrentPage(0); 
                      setstart_limit(0);
                      setDatatrue(true);
                      setActiveStep(0);
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M6 19.7C5.7 19.7 5.5 19.6 5.3 19.4C4.9 19 4.9 18.4 5.3 18L18 5.3C18.4 4.9 19 4.9 19.4 5.3C19.8 5.7 19.8 6.29999 19.4 6.69999L6.7 19.4C6.5 19.6 6.3 19.7 6 19.7Z"
                        fill="currentColor"
                      />
                      <path
                        d="M18.8 19.7C18.5 19.7 18.3 19.6 18.1 19.4L5.40001 6.69999C5.00001 6.29999 5.00001 5.7 5.40001 5.3C5.80001 4.9 6.40001 4.9 6.80001 5.3L19.5 18C19.9 18.4 19.9 19 19.5 19.4C19.3 19.6 19 19.7 18.8 19.7Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
              <div className="overflow-auto p-0 m-0 flex-grow custom-height">
                <div className="mt-6 flex flex-col grow max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 items-center justify-center">
                  <div className="flex flex-col items-center w-full overflow-y-auto">
                    <div className="relative overflow-x-auto  w-full rounded-md text-gray-900 bg-green-100 p-4 text-sm font-medium">
                      Thank you for your business. We eagerly look forward to
                      fulfilling more of your orders in the future.
                    </div>
                  </div>
                </div>

                <div className="max-w-screen-xl mx-auto px-2 sm:px-6 md:px-6 lg:px-8 flex flex-row justify-end mt-4 mb-2">
                  <button
                    type="submit"
                    form="kt_modal_checkoutallitems"
                    className="text-white self-center bg-gray-700 hover:bg-gray-900 focus:outline-none font-medium rounded-full text-sm px-4 py-2 inline-flex items-center shadow-md"
                    onClick={() => {
                      setNewMinOrder([]);
                      setSearch_item("%");
                      setItemto_order("products_id");
                      setDesorasc("ASC");
                      sessionStorage.setItem(
                        "newTabledata",
                        JSON.stringify([])
                      );
                      setSelection([]);
                      setCurrentPage(0); 
                      setstart_limit(0);
                      setDatatrue(true);
                      setActiveStep(0)
                    }}
                  >
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return "Unknown stepIndex";
    }
  };

  return <>{GetStepContent(activeStep)}</>;
};

export default Drawer;
