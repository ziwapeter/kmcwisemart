import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Poppins } from "next/font/google";
import { MainContent } from "./maincontent";
import WhatsAppButton from "./helpers/whatsappbutton";


//const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: "swap",
});


export const metadata: Metadata = {
  title:"Kmcwisemart | A Cut Above The Best!",
  description: "KMCWiseMart: Kenya's innovative meat franchise, delivering the finest quality products. Powered by Kenya Meat Commission, blending tradition and modernity.",
  applicationName:"Kmcwisemart"
};

export default function RootLayout({
  children,
 
}: {
  children: React.ReactNode;

}) {
  
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <div className="homepage-background">
          <div className="containerhome" id="homemainscreen">
          <MainContent>{children}</MainContent>
        
          </div>
        </div>
      </body>
    </html>
  );
}


