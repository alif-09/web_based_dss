import React from 'react';

interface MethodSelectionProps {
  selectedMethod: 'saw' | 'wp' | 'topsis' | 'ahp'; // Pastikan hanya metode yang valid
  onSelectMethod: (method: 'saw' | 'wp' | 'topsis' | 'ahp') => void; // Pastikan hanya metode yang valid
}

const MethodSelection: React.FC<MethodSelectionProps> = ({ selectedMethod, onSelectMethod }) => {
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'saw' | 'wp' | 'topsis' | 'ahp'; // Casting nilai ke jenis yang tepat
    onSelectMethod(value); // Memanggil callback saat metode berubah
  };

  return (
    <div className="w-full px-5 my-4 bg-background">
      <div className='container mx-auto'>
      <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
        Pilih Metode:
      </label>
      <select
        value={selectedMethod} // Gunakan selectedMethod dari props
        onChange={handleMethodChange}
        className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <option value="wp">Weighted Product (WP)</option>
        <option value="saw">Simple Additive Weighting (SAW)</option>
        <option value="topsis">TOPSIS</option>
        <option value="ahp">Analytic Hierarchy Process (AHP)</option>
      </select>
      </div>
    </div>
  );
};

export default MethodSelection;
