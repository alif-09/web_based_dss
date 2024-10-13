// components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white py-10 px-10 w-full">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl font-bold">Multi Attribute Decision Making Calculator</h1>
      </div>
    </header>
  );
};

export default Header;
