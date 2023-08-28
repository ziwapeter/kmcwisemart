
"use client"
import {useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";
import Image from "next/image";
import Link from "next/link";


  
  type Props = {
    src: string;
    alt: string;
    cat: string;
    title: string;
  };
  export const ImageCard: React.FC<Props> = ({ src, alt, cat, title }) => {
  
    const {
      setSearch_item,
    } = useMyCheckoutData();


  
  return (
    
      <div className="w-full">
           <Link
                href="/products"
                onClick={() => {
                  setSearch_item(cat);
                }}>
        <Image  className="rounded " src={src} alt={alt} width={600} height={315} placeholder="blur" style={{objectFit: "contain"}} loading="lazy" blurDataURL="data:image/jpeg..." />
        </Link>
      
    </div>
  )};
  