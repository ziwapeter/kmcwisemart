import React from "react";

import Singleproduct from "@/app/lib/singleproduct";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";


async function getAllproducts(products_id: number) {
  const response = await fetch(
    `https://kmcwisemartapis.kmcwisemart.co.ke/allproducts?products_id=${products_id}`,
    { cache: "no-cache" }
  );
  const data = await response.json();

  return data[0];
}


async function getAllfrequentProducts(category_name: string, products_id: number) {
  const response = await fetch(
    `https://kmcwisemartapis.kmcwisemart.co.ke/allrelatedproducts?products_id=${products_id}&category_name=${category_name}`,
    { cache: "no-cache" }
  );
  const data = await response.json();

  return data;
}


export async function generateMetadata({
  params,
}: {
  params: { products_id: number; category_name: string };
}): Promise<Metadata> {
  // read route params
  const productseo =  await fetch(`https://kmcwisemartapis.kmcwisemart.co.ke/allseoproducts?products_seo_id=${params.products_id}`).then((res) => res.json())
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const fullUrl = headersList.get("referer") || "";

  return {
    metadataBase: new URL("https://kmcwisemart.co.ke/"),
    title: "Kmcwisemart | " + `${productseo[0].products_seo_name}`,
    description: `${productseo[0].products_seo_description}`,
    applicationName: "Kmcwisemart",
    openGraph: {
      title: "Kmcwisemart | " + `${productseo[0].products_seo_name}`,
      description: `${productseo[0].products_seo_description}`,
      siteName: "Kmcwisemart",
      images:
        "https://kmcwisemart.co.ke/products2/" +
        `${productseo[0].products_seo_image_url}`,
      url: `${fullUrl}`,
      type: "website",
    },
  };
}

export default async function Productids({
  params,
}: {
  params: { products_id: number; category_name: string };
}) {
  const product = await getAllproducts(Number(params.products_id));
  const frequentproducts = await getAllfrequentProducts(params.category_name, Number(params.products_id));

  return (
    <main className="flex flex-col grow max-w-screen-xl mx-auto p-2 sm:p-4 lg:p-6 items-center justify-center">
      <Singleproduct product={product ? product : {}} params={params}  frequentproducts={frequentproducts ? frequentproducts : {}}/>

    </main>
  );
}
