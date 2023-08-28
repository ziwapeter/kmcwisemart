import React, { FC } from 'react'

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="grow-0 text-gray-800 py-4 background-crimson">
      <div className='max-w-screen-xl mx-auto text-center invert-svg'>
      &copy; {new Date().getFullYear()} smartonsolutions
      </div>
    </footer>
  );
}

export default Footer;
