import React from "react";

// Define the props interface
interface TableProps {
  headers?: string[]; // Optional headers prop
  data?: any[][]; // Optional data prop
  stepTitle?: string; // Optional step title prop
}

const Table: React.FC<TableProps> = ({ headers = [], data = [], stepTitle }) => {
  return (
    <table className="min-w-full text-sm text-gray-700 dark:text-gray-300 text-center border-collapse">
      <thead>
        {/* Baris pertama untuk judul langkah */}
        {stepTitle && (
          <tr>
            <th colSpan={headers.length} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 font-semibold border border-black dark:border-white">
              {stepTitle}
            </th>
          </tr>
        )}
        {/* Baris kedua untuk header kolom */}
        <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 uppercase tracking-wide text-xs">
          {headers.length > 0 ? (
            headers.map((header, index) => (
              <th key={index} className="px-6 py-3 border border-black dark:border-white">
                {header}
              </th>
            ))
          ) : (
            <th className="px-6 py-3 border border-black dark:border-white">No headers provided</th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-700">
        {/* Render table data */}
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-gray-50 dark:bg-gray-700">
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="px-7 py-3 border border-black dark:border-white">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td className="px-6 py-3 border border-black dark:border-white" colSpan={headers.length || 1}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
