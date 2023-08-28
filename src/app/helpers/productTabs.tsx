// components/Tabs.js
"use client"
import React, { FC, useState } from 'react';

interface Props {
  product: any;
}

const ProductTabs: FC<Props> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
  };

  return (
    <>
    <div className="mb-4 border-b border-gray-200 flex" id="myTab" role="tablist">
      <button
        className={`inline-block p-4 border-b-2 rounded-t-lg ${
          activeTab === 'description' ? 'border-blue-500' : 'border-transparent'
        }`}
        id="description-tab"
        type="button"
        role="tab"
        aria-controls="description"
        aria-selected={activeTab === 'description'}
        onClick={() => handleTabClick('description')}
      >
        <span className='text-md font-semibold'>Description</span>
      </button>
      <button
        className={`inline-block p-4 border-b-2 rounded-t-lg ${
          activeTab === 'delivery' ? 'border-blue-500' : 'border-transparent'
        }`}
        id="delivery-tab"
        type="button"
        role="tab"
        aria-controls="delivery"
        aria-selected={activeTab === 'delivery'}
        onClick={() => handleTabClick('delivery')}
      >
        <span className='text-md font-semibold'>Delivery</span>
      </button>
    </div>
    <div id="myTabContent">
      <div
        className={`${
          activeTab === 'description' ? 'block' : 'hidden'
        } p-4 rounded-lg bg-gray-800`}
        id="description"
        role="tabpanel"
        aria-labelledby="description-tab"
      >
        <p className="text-sm font-bold text-gray-400">
        <span className='font-medium text-white'>Product Description</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {product.product_description}
        </p>
      </div>
      <div
        className={`${
          activeTab === 'delivery' ? 'block' : 'hidden'
        } p-4 rounded-lg bg-gray-800`}
        id="delivery"
        role="tabpanel"
        aria-labelledby="delivery-tab"
      >
         <p> <strong className="font-medium text-white text-sm">Delivery & Shipping</strong></p>
        <p className="text-sm text-gray-400 mt-2">
      
       
          If you are within <strong className="font-mediumtext-white">RUIRU AREA</strong>, orders will be delivered within <strong className="font-medium text-white">40 minitues or less</strong>. Should you have any queries or need to expedite your order, do not hesitate to reach out. You can contact us directly via call or WhatsApp message at this number: <strong className="font-medium text-white">+254 703 797 444</strong>.
        </p>
      </div>
    </div>
  </>
  
  
  );
};

export default ProductTabs;
