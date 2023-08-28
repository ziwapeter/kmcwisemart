// components/WhatsAppButton.tsx
import React, { useEffect, useState } from "react";

const WhatsAppButton: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (showPopup) {
      timerId = setTimeout(() => {
        setShowPopup(false);
      }, 5000); 
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [showPopup]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowPopup(true);
          } else {
            setShowPopup(false);
          }
        });
      },
      { threshold: 0.1 } 
      
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, []);

  const onClick = () => {
    window.open("https://wa.me/254703797444", "_blank"); // Replace with your WhatsApp number
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  

  return (
    <div className="fixed bottom-4 right-6 z-50" ref={buttonRef}>

{showPopup && (
         <div className="absolute bottom-20 right-5 bg-white rounded-md shadow-lg w-64 z-50">
        <div className=" border-b-[1px] mb-2">
          <div className="flex justify-between items-center p-2"> 
          <div className="text-sm font-semibold text-gray-700">
            Feedback & Enquiries
          </div>
          <button onClick={closePopup} className="text-gray-600 hover:text-gray-800 transition duration-150">
            <span>
            <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M6 19.7C5.7 19.7 5.5 19.6 5.3 19.4C4.9 19 4.9 18.4 5.3 18L18 5.3C18.4 4.9 19 4.9 19.4 5.3C19.8 5.7 19.8 6.29999 19.4 6.69999L6.7 19.4C6.5 19.6 6.3 19.7 6 19.7Z"
                        fill="currentColor"
                      />
                      <path
                        d="M18.8 19.7C18.5 19.7 18.3 19.6 18.1 19.4L5.40001 6.69999C5.00001 6.29999 5.00001 5.7 5.40001 5.3C5.80001 4.9 6.40001 4.9 6.80001 5.3L19.5 18C19.9 18.4 19.9 19 19.5 19.4C19.3 19.6 19 19.7 18.8 19.7Z"
                        fill="currentColor"
                      />
                    </svg>


            </span>
          </button>
          </div>
        </div>
        <div className="text-sm font-normal text-gray-600 pb-2 pr-2 pl-2">
        Please feel free to share your <span className="font-semibold">feedback</span> or <span className="font-semibold">inquiries</span> with us.
        </div>
      
      </div>
      
      )}
      <button
        onClick={onClick}
        className="bg-[#25D366] p-3 w-16 h-16 rounded-full text-white  focus:border-green-700 flex items-center justify-center"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            fill="#fff"
            version="1.1"
            viewBox="0 0 308 308"
            xmlSpace="preserve"
          >
            <g>
              <path d="M227.904 176.981c-.6-.288-23.054-11.345-27.044-12.781-1.629-.585-3.374-1.156-5.23-1.156-3.032 0-5.579 1.511-7.563 4.479-2.243 3.334-9.033 11.271-11.131 13.642-.274.313-.648.687-.872.687-.201 0-3.676-1.431-4.728-1.888-24.087-10.463-42.37-35.624-44.877-39.867-.358-.61-.373-.887-.376-.887.088-.323.898-1.135 1.316-1.554 1.223-1.21 2.548-2.805 3.83-4.348a140.77 140.77 0 011.812-2.153c1.86-2.164 2.688-3.844 3.648-5.79l.503-1.011c2.344-4.657.342-8.587-.305-9.856-.531-1.062-10.012-23.944-11.02-26.348-2.424-5.801-5.627-8.502-10.078-8.502-.413 0 0 0-1.732.073-2.109.089-13.594 1.601-18.672 4.802C90 87.918 80.89 98.74 80.89 117.772c0 17.129 10.87 33.302 15.537 39.453.116.155.329.47.638.922 17.873 26.102 40.154 45.446 62.741 54.469 21.745 8.686 32.042 9.69 37.896 9.69h.001c2.46 0 4.429-.193 6.166-.364l1.102-.105c7.512-.666 24.02-9.22 27.775-19.655 2.958-8.219 3.738-17.199 1.77-20.458-1.348-2.216-3.671-3.331-6.612-4.743z"></path>
              <path d="M156.734 0C73.318 0 5.454 67.354 5.454 150.143c0 26.777 7.166 52.988 20.741 75.928L.212 302.716a3.998 3.998 0 004.999 5.096l79.92-25.396c21.87 11.685 46.588 17.853 71.604 17.853C240.143 300.27 308 232.923 308 150.143 308 67.354 240.143 0 156.734 0zm0 268.994c-23.539 0-46.338-6.797-65.936-19.657a3.996 3.996 0 00-3.406-.467l-40.035 12.726 12.924-38.129a4.002 4.002 0 00-.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 0-65.543 53.754-118.867 119.826-118.867 66.064 0 119.812 53.324 119.812 118.867.001 65.535-53.746 118.851-119.811 118.851z"></path>
            </g>
          </svg>
        </span>
      </button>

     
    </div>
  );
};

export default WhatsAppButton;
