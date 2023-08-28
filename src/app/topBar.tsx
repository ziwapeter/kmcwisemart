"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/kmcwisemart3.svg";
import Link from "next/link";
import TopBarNav from "./topBarNav";
import { useMyCheckoutData } from "@/app/helpers/MyCheckoutContext";

interface Props {
  onClick: () => void;
}

const TopBar: React.FC<Props> = ({onClick}) => {

  const {
  
    isScrolled,
    setIsScrolled
  } = useMyCheckoutData();

  useEffect(() => {
    function scrollingEffect () {
    const container: any = document.getElementById("homemainscreen");

    if (container) {
      // Immediately check if the container is scrolled.
      const atTop = container.scrollTop 
      setIsScrolled(!atTop);

      const handleScroll = () => {
        const atTop = container.scrollTop === 0;
        setIsScrolled(!atTop);
      };

      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }}

    scrollingEffect()
  }, [setIsScrolled]);

  useLayoutEffect(() => {
    function updateHeight() {
      const container = document.getElementById("homemainscreen");
      if (container) {
        container.style.height = window.innerHeight + "px";
      }
    }

    window.addEventListener("resize", updateHeight);

    // Set the initial height
    updateHeight();

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const topBarClassName = isScrolled
    ? "p-4 background-crimson shadow-lg transition-all duration-300"
    : "p-4 transition-all duration-300";
  return (
   
      <header className={`${topBarClassName}`}>
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" as='/'>
            
              <Image
                src={logo}
                alt="kmcwisemart Logo"
                className="invert-svg w-44 sm:w-44 md:w-48 lg:w-48"
                width={210}
                height={42.07}
                priority
              />
              
            </Link>
          </div>
          
           <TopBarNav onClick={onClick} />
        </div>
      </header>
   
  );
};

export default TopBar;