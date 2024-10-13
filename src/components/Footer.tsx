import React from 'react';
import Image from 'next/image'; // Import next/image
import alif from '../app/pict/alif.jpg'
import tegar from '../app/pict/tegar.jpg'
import zhafran from '../app/pict/zhafran.jpg'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 w-full mt-8">
      <div className="container mx-auto text-center">
        <p className="text-l font-semibold">
          UTS Decision Support System (DSS) 2024
        </p>
        <div className="grid grid-cols-3 text-sm gap-4 mb-4 mt-4">
          <div className="flex flex-col items-center">
            <Image src={zhafran} alt="Zhafran" width={64} height={64} className="rounded-full mb-2" />
            <p>Muhammad Zhafran Shiddiq</p>
            <p>140810220007</p>
          </div>
          <div className="flex flex-col items-center">
            <Image src={tegar} alt="Tegar" width={64} height={64} className="rounded-full mb-2" />
            <p>Tegar Muhamad Rizki</p>
            <p>140810220034</p>
          </div>
          <div className="flex flex-col items-center">
            <Image src={alif} alt="Alif" width={64} height={64} className="rounded-full mb-2" />
            <p>Alif Al Husaini</p>
            <p>140810220036</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
