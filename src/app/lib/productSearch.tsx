"use client"
import React, { useEffect, useRef, useState } from 'react'
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import { usePathname, useRouter } from 'next/navigation';
const ProductSearch = () => {
    const myRefsearch: any = useRef()
    const pathname = usePathname();
    const userouter = useRouter();
    const [inputValue, setInputValue] = useState("");
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
      
      const resetToFirstPage = () => {
        setCurrentPage(0);  // This will force the page to reset to the first page.
        setstart_limit(0);  // If needed, also reset the offset.
      };
      const product: string = productMapping[search_item] || "All Products";
      useEffect(() => {
        const handleValueChange = () => {
          if (myRefsearch.current.value === '' && myRefsearch.current === document.activeElement) {
            setIds_toupdate([])
            setSearch_item('%')
            setPaginationsize(10)
            setstart_limit(0)
            setItemto_order('products_id')
            resetToFirstPage()
            setDesorasc('ASC')
          }
        }
    
        const refSearch = myRefsearch.current;
        if (refSearch) {
          refSearch.addEventListener('input', handleValueChange);
        }
    
        return () => {
          if (refSearch) {
            refSearch.removeEventListener('input', handleValueChange);
          }
        }
      }, []);
      const handlesearchKeyDown = (event: any) => {
        if (event.key === 'Enter') {
          if(pathname != "/products"){
            userouter.push("/products")
          }
          if (inputValue) {
           
            setSearch_item('%' + inputValue.trim() + '%');
          } else {
          
            setSearch_item('%');
          }
          setIds_toupdate([])
          setPaginationsize(10);
          setstart_limit(0);
        setItemto_order('products_id');
        resetToFirstPage()
        setDesorasc('ASC');
         };
       }
    
      const handlesearchKeyDown2 = () => {
     
        if(pathname != "/products"){
          userouter.push("/products")
        }
        if (inputValue) {
    
          setSearch_item('%' + inputValue.trim() + '%');
        } else {
         
          setSearch_item('%');
        }
        setIds_toupdate([])
        setPaginationsize(10);
        setstart_limit(0);
        setItemto_order('products_id');
        resetToFirstPage()
        setDesorasc('ASC');
      }
    
    
      const handleinputs = (event: any) => {
        setInputValue(event.target.value);
        if (event.target.value === '') {
         
          setIds_toupdate([])
          setSearch_item('%')
          setPaginationsize(10)
          setstart_limit(0)
          setItemto_order('products_id')
          resetToFirstPage()
          setDesorasc('ASC')
        }
      }
    
  return (
    <>
     <div className="max-w-screen-xl mx-auto mb-4">
            <div className="relative flex items-center w-full h-12 rounded-full focus-within:shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-300 ms-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                ref={myRefsearch}
                className="peer h-full w-full outline-none text-sm text-gray-900 pr-2 font-medium"
                type='search'
                id="search"
                placeholder="Search Products ..."
                onChange={handleinputs}
                onKeyDown={handlesearchKeyDown}
              />
              <button
                 type="button"
                className="text-white self-center bg-blue-500 hover:bg-blue-700  focus:outline-none font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-700 me-2 shadow-md"
                onClick={handlesearchKeyDown2}
                // value={searchTitle}
               
              >
                Search
              </button>
            </div>
          </div>
    </>
  )
}

export default ProductSearch