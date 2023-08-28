"use client"
import React, { useEffect, useRef, useState } from 'react'
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import { usePathname, useRouter } from 'next/navigation';
export default function ProductSwitcher() {
    const pathname = usePathname();
    const userouter = useRouter();
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
        selectedOption, 
        setSelectedOption
      } = useMyCheckoutData();
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
   
    type CategoryType = {
        category: string;
        title: string;
        category2: string;
      }
    const categories: CategoryType[] = [
        { category: "Beef", title: "Beef Products", category2: "BEEF" },
        { category: "Goat", title: "Goat Products", category2: "GOAT" },
        { category: "Lamb", title: "Lamb Products", category2: "LAMB" },
        { category: "Offals", title: "Offals", category2: "OFFALS" },
        { category: "By Products", title: "By Products", category2: "BY PRODUCTS" },
        { category: "Value Adds", title: "Value Adds", category2: "VALUE ADDS" },
        { category: "Favourites", title: "Favourite Products", category2: "FAVOURITES" },
      ];

        // Handle initial search_item value
  useEffect(() => {
    if (search_item) {
      if (search_item === "%") {
        setSelectedOption("All");
      } else {
        if(categories.some(
          (category) => category.category2 === search_item.replace("%", "")
        )){
        const formattedSearchItem = search_item
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setSelectedOption(formattedSearchItem);}
        else{
          setSelectedOption("All");
        }
      }
    }
  }, [search_item]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Bind the event listener
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

    const resetToFirstPage = () => {
        setCurrentPage(0);  // This will force the page to reset to the first page.
        setstart_limit(0);  // If needed, also reset the offset.
      };
    const handleClick = (option: string) => {
        resetToFirstPage()
        setSelectedOption(option);
        if (option === "Category") {
          setIsOpen(!isOpen);
        } else {
          if (option === "All") {
            if(pathname != "/products"){
                userouter.push("/products")
              }
            setSearch_item("%");
          } else {
            if(pathname != "/products"){
                userouter.push("/products")
              }
            setSearch_item(option.toLocaleUpperCase());
          }
          setIsOpen(false);
        }
      };
    
      const handleClick2 = (option: string) => {
        if (
          categories.some((categoryObj) => categoryObj.category === option) ||
          option === "Category"
        ) {
          setIsOpen(!isOpen);
        } else {
          setIsOpen(false);
        }
      };
    
  return (
   <>
   <div className="flex flex-wrap justify-center mb-6" ref={ref}>
          <div className={`mx-8 shadow rounded-full border h-10 mt-4 flex p-1 relative items-center bg-gray-200 w-full sm:w-full md:w-2/3 lg:w-1/3 xl:w-1/4`}>
            <div className="w-1/2 flex justify-center">
              <button
                onClick={() => handleClick("All")}
                className="font-medium w-full text-gray-400 mr-1 text-sm"
              >
                All
              </button>
            </div>
            <div className="w-1/2 flex justify-center relative">
              <button
                key={2333}
                onClick={() => handleClick("Category")}
                className="font-medium w-full text-gray-400 ml-1 text-sm"
              >
                Category
              </button>
              {(selectedOption === "Category" ||
                categories.some(
                  (categoryObj) => categoryObj.category === selectedOption
                )) &&
                isOpen && (
                  <div className="origin-top-right absolute right-0 top-10 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
                    <div className="py-1">
                      {categories.map((categoryObj, index) => (
                        <button
                          key={index}
                          onClick={() => handleClick(categoryObj.category)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                        >
                          {categoryObj.category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <span
              className={`elSwitch bg-white shadow text-gray-700 flex items-center justify-center w-1/2 rounded-full h-8 transition-all top-1 absolute font-medium text-sm ${
                selectedOption === "All" ? "left-1" : "right-1"
              } ${
                categories.some(
                  (categoryObj) => categoryObj.category === selectedOption
                ) || selectedOption === "Category"
                  ? "cursor-pointer"
                  : ""
              }`}
              onClick={() => handleClick2(selectedOption)}
            >
              {selectedOption}
            </span>
          </div>
        </div>
   </>
  )
}
