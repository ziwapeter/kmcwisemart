import { useState, useMemo } from 'react';
import Select from 'react-select';


export const useSelectStyles = () => {

  const customStyles: any = useMemo(() => ({
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: '#d1d5db',
      backgroundColor:"#f9fafb",
      lineHeight: 1.25,
      padding: "2px"
    
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      borderColor: '#d1d5db',
     
  
    }),
    singleValue: (provided: any, state: any) => ({
        ...provided,
        color: null,
      }),

      input: (provided: any) => ({
        ...provided,
        color: null,
      }),
      
      

  }), []);

  

  return customStyles;
};