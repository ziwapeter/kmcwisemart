import React, { ReactNode, createContext, useContext, useState } from "react";
export const addCommas = (num: any) =>
  num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
type MyCheckoutData = {
  start_limit: number;
  setstart_limit: React.Dispatch<React.SetStateAction<number>>;
  paginationsize: number;
  setPaginationsize: React.Dispatch<React.SetStateAction<number>>;
  newMinOrder: any[];
  setNewMinOrder: React.Dispatch<React.SetStateAction<any[]>>;
  cachedTable: any[];
  setCachedTable: React.Dispatch<React.SetStateAction<any[]>>;
  search_item: string;
  setSearch_item: React.Dispatch<React.SetStateAction<string>>;
  itemto_order: string;
  setItemto_order: React.Dispatch<React.SetStateAction<string>>;
  desorasc: string;
  setDesorasc: React.Dispatch<React.SetStateAction<string>>;
  ids_toupdate: number[];
  setIds_toupdate: React.Dispatch<React.SetStateAction<number[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  isScrolled: boolean;
  setIsScrolled: React.Dispatch<React.SetStateAction<boolean>>;
  datatrue: boolean;
  setDatatrue: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
};

type MyCheckoutProviderProps = {
  children: ReactNode;
};

const MyCheckoutContext = createContext<MyCheckoutData | undefined>(undefined);

export const useMyCheckoutData = (): MyCheckoutData => {
  const context = useContext(MyCheckoutContext);

  if (!context) {
    throw new Error(
      "useMyCheckoutData must be used within a MyCheckoutProvider"
    );
  }

  return context;
};

export const MyCheckoutProvider: React.FC<MyCheckoutProviderProps> = ({
  children,
}) => {
  const [newMinOrder, setNewMinOrder] = useState<any[]>([]);
  const [cachedTable, setCachedTable] = useState<any[]>([]);
  const [search_item, setSearch_item] = useState<string>("%");
  const [itemto_order, setItemto_order] = useState<string>("products_id");
  const [desorasc, setDesorasc] = useState<string>("ASC");
  const [ids_toupdate, setIds_toupdate] = useState<number[]>([]);
  const [start_limit, setstart_limit] = useState<number>(0);
  const [paginationsize, setPaginationsize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [datatrue, setDatatrue ] = useState<boolean>(true)
  const [selectedOption, setSelectedOption] = useState<string>("All");

  const contextValue: MyCheckoutData = {
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
    isScrolled,
    setIsScrolled,
    datatrue,
     setDatatrue,
     selectedOption, 
     setSelectedOption
  };

  return (
    <MyCheckoutContext.Provider value={contextValue}>
      {children}
    </MyCheckoutContext.Provider>
  );
};
