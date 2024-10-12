"use client"; // Ensure this is at the very top
import React, { useState } from 'react';
import InputForm from '../components/Input'; // General InputForm
import AHPInputForm from '../components/AhpInput'; // Import the AHPInputForm
import MethodSelection from '../components/MethodSelection';
import Calculator from '../components/Calculator';

const MainPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'saw' | 'wp' | 'topsis' | 'ahp'>('wp'); // Default method
  const [weights, setWeights] = useState<number[]>([50, 50]);
  const [types, setTypes] = useState<string[]>(['benefit', 'benefit']);
  const [tableData, setTableData] = useState<number[][]>([]);
  const [shouldCalculate, setShouldCalculate] = useState(false); // State for calculation trigger

  const handleMethodSelect = (method: 'saw' | 'wp' | 'topsis' | 'ahp') => {
    setSelectedMethod(method);
    setTableData([]); // Reset table data when method changes
    setShouldCalculate(false); // Reset calculation trigger when method changes
  };

  const handleFormSubmit = (data: {
    rows: number;
    cols: number;
    weights: number[];
    types: string[];
    values: number[][]; // Adjusted according to input format
  }) => {
    setWeights(data.weights);
    setTypes(data.types);
    setTableData(data.values);
    setShouldCalculate(true);
  };

  const handleAHPFormSubmit = (data: {
    criteria: string[];
    alternatives: string[];
    pairwiseComparison: {
      criteria: number[][];
      alternatives: number[][][];
    };
  }) => {
    const alternativesComparison = data.pairwiseComparison.alternatives;
  
    // Example: Use the comparison from the first criterion
    const selectedCriterionComparison = alternativesComparison[0]; // Choose a specific criterion
  
    setWeights(Array(data.alternatives.length).fill(1)); // Equal weights initially
    setTypes(Array(data.alternatives.length).fill('benefit')); // Assuming all alternatives are 'benefit'
    
    // Set tableData with the selected criterion's comparison
    setTableData(selectedCriterionComparison); // Now this is a number[][]
    setShouldCalculate(true);
  };
  
  const handleReset = () => {
    setWeights([50, 50]);
    setTypes(['benefit', 'benefit']);
    setTableData([]);
    setShouldCalculate(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Decision Support System (DSS)</h1>

      {/* Method Selection Component */}
      <MethodSelection onSelectMethod={handleMethodSelect} selectedMethod={selectedMethod} />

      {/* Conditionally render InputForm or AHPInputForm based on selected method */}
      {selectedMethod === 'ahp' ? (
        <AHPInputForm onCalculate={handleAHPFormSubmit} />
      ) : (
        <InputForm onCalculate={handleFormSubmit} onReset={handleReset} method={selectedMethod} />
      )}

      {/* Render Calculator Component if valid table data and the calculate trigger is true */}
      {shouldCalculate && tableData.length > 0 && tableData[0].length > 0 && (
        <Calculator tableData={tableData} weights={weights} types={types} method={selectedMethod} />
      )}

      {/* Display input table data for debugging or interim results */}
      {tableData.length > 0 && tableData[0].length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Data yang Diinput</h2>
          <pre>{JSON.stringify(tableData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MainPage;
