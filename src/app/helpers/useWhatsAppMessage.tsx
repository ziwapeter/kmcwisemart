import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';


type FormValues = {
  location: string;
  name: string;
  mobile: string;
  estatehouseno: string;
  landmark: string;
  additionaldetails: string;
  transport: string;
  totalpayable: string;
  productstotal: number;
};

type OrderDetails = {
  products_id: number;
  products_name: string;
  product_description: string;
  products_price: number;
  unit_id: number;
  category_id: number;
  product_division: number;
  image_url: string;
  max_order: number;
  min_order: number;
  unit_name: string;
  category_name: string;
  category_description: string;
};

const addCommas = (num: any) => (num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0');


export const useWhatsAppMessage = () => {
 
  
  const sendWhatsAppMessage = useCallback(
    (number: string, values: FormValues, orderDetails: OrderDetails[]) => {
      return new Promise<void>((resolve, reject) => {
        try {
          let transportText = '';
          if (values.transport === 'NEGOTIABLE') {
            transportText = 'NEGOTIABLE';
          } else {
            transportText = addCommas(Number(values.transport).toFixed(2)) + ' ' + process.env.currency;
          }
  
          const message = 
            `*Customer Details:*\n---------------------------------------\n\n*Name:* ${values.name}\n*Location:* ${values.location}\n*Mobile:* ${values.mobile}\n*Estate House No:* ${values.estatehouseno ? values.estatehouseno : 'Not Available'}\n*Landmark:* ${values.landmark ? values.landmark : 'Not Available'}\n*Additional Details:* ${values.additionaldetails ? values.additionaldetails : 'Not Available'}\n*Transport:* ${transportText}\n\n*Products Ordered:*\n---------------------------------------\n\n${orderDetails.map((order:any)=>`*Product Name:* ${order.products_name}\n*Quantity:* ${order.min_order}\n*Price:* ${addCommas(Number(order.products_price).toFixed(2))} ${process.env.currency}`).join('\n---------------------------------------\n')}\n\n*Total Amount Payable:*\n---------------------------------------\n\n*Total Price:* ${values.transport === 'NEGOTIABLE'?addCommas(Number(values.productstotal).toFixed(2)) + ' ' + process.env.currency + ' ' + '(Transport to be Negotiated)':addCommas(Number(values.totalpayable).toFixed(2)) + ' ' + process.env.currency}\n\n\n`;
  
          const encodedMessage = encodeURIComponent(message);
          const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodedMessage}`;
  
          window.open(url, '_blank');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    []
  );
  
  return sendWhatsAppMessage;
};

