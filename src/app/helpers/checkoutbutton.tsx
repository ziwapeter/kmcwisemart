import { FC, useEffect, useMemo, useState } from "react";
import { addCommas, useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
interface Props {
  onClick: () => void;
}

// Define the shape of the data we're expecting
interface TableData {
  [key: string]: any;
}

const FloatingButton: FC<Props> = ({ onClick }) => {
  const {
    isScrolled,
    setIsScrolled,
    datatrue,
    setDatatrue 
  } = useMyCheckoutData();

  const storageData: any = typeof window !== "undefined" ? sessionStorage.getItem("newTabledata") : null;
  const storagefavourite: any = typeof window !== "undefined" ? sessionStorage.getItem("favouriteSelections") : null;
  const parsedStorageData: any = storageData ? JSON.parse(storageData) : null;
  const parsedFavouriteData: any = storagefavourite ? JSON.parse(storagefavourite) : null;
  
  const favouriteDataReturned: any = parsedFavouriteData ?? [];

  const [datahasloaded, setDatahasloaded] = useState<any>([])
  const storageDataReturned: any = useMemo(() => parsedStorageData ?? [], [parsedStorageData]);
 

 useEffect(() => {
    // Check if the data has been loaded before setting the loading state to false
    if (datatrue && storageDataReturned && storageDataReturned.length >= 0) {
      setDatahasloaded(storageDataReturned);
      setDatatrue(false)
    }
   
  }, [storageDataReturned, datatrue, setDatatrue]);
  

  

  return (
    <>
      {(datahasloaded && datahasloaded.length > 0) && (
        <button
          onClick={onClick}
          className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-medium  fixed right-0 mr-0 bottom-1/2 transform translate-y-1/2 z-20 px-2 py-4 rounded-l-lg rounded-r-none  shadow-lg"
        >
         <span className="vertical-text"> View Cart</span>
        </button>
      )}
    </>
  );
};

export default FloatingButton;
