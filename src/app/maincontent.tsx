"use client";
import TopBar from "./topBar";
import Footer from "./footer";
import React, { FC, ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { MyCheckoutProvider } from "./helpers/MyCheckoutContext";
import FloatingButton from "./helpers/checkoutbutton";
import Drawer from "./helpers/checkoutdrawer";

import { QueryParams, fetchProducts, queryClientproducts } from "./lib/allproducts";
import { QueryClientProvider, dehydrate, hydrate } from "react-query";
import WhatsAppButton from "./helpers/whatsappbutton";
interface Props {
  children: ReactNode;
  dehydratedState?: unknown;
}



export const MainContent: FC<Props> = ({ children, dehydratedState}) => {
 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useLayoutEffect(() => {
    const fetchAndSetData = async () => {
      await getPrefechdata();
    };
    
    fetchAndSetData();
  }, []);

  const handleButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  hydrate(queryClientproducts, dehydratedState)

  return (
    <>
      <MyCheckoutProvider>
      <QueryClientProvider client={queryClientproducts} contextSharing={true}>
        <div className="fixed w-full z-30">
          <TopBar onClick={handleButtonClick} />
        </div>
        <div className="flex flex-col custom-height z-10">
          {children}

          <FloatingButton onClick={handleButtonClick} />
          <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
          <Footer />
          <WhatsAppButton />
        </div>
    </QueryClientProvider>
      </MyCheckoutProvider>
    </>
  );
};


export async function getPrefechdata() {

  const searchParams: QueryParams = {
    start_limit: 0,
    paginationsize: 10,
    itemto_order: "products_id",
    desorasc: "ASC",
    search_item: "%",
    ids_toupdate: [],
  };
  const previousDataKey = ["products", 0, 10, "%", "products_id", "ASC", []];

  await queryClientproducts.prefetchQuery(previousDataKey, () =>
    fetchProducts(searchParams)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClientproducts),
    },
  };
}