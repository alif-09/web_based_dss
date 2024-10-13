"use client"; // Ensure this is at the top
import React, { useState } from 'react';
import InputForm from '../components/Input'; // General InputForm component
import AHPInputForm from '../components/AhpInput'; // Import AHPInputForm
import MethodSelection from '../components/MethodSelection';
import Calculator from '../components/Calculator';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'saw' | 'wp' | 'topsis' | 'ahp'>('wp'); // Default method
  const [weights, setWeights] = useState<number[]>([50, 50]); // Default weights
  const [types, setTypes] = useState<string[]>(['benefit', 'benefit']); // Default types
  const [tableData, setTableData] = useState<number[][]>([]); // Alternative table data
  const [shouldCalculate, setShouldCalculate] = useState(false); // Trigger for calculation

  // State for storing criteria and alternatives comparisons for AHP
  const [criteriaComparison, setCriteriaComparison] = useState<number[][] | undefined>(undefined);
  const [alternativesComparison, setAlternativesComparison] = useState<number[][][] | undefined>(undefined);

  // Handle method selection
  const handleMethodSelect = (method: 'saw' | 'wp' | 'topsis' | 'ahp') => {
    setSelectedMethod(method);
    setTableData([]); // Reset table data when method changes
    setShouldCalculate(false); // Reset calculation trigger when method changes
    setCriteriaComparison(undefined); // Reset criteria comparison
    setAlternativesComparison(undefined); // Reset alternatives comparison
  };

  // Handle data submission from InputForm
  const handleFormSubmit = (data: {
    rows: number;
    cols: number;
    weights: number[];
    types: string[];
    values: number[][]; // Input data format
  }) => {
    setWeights(data.weights);
    setTypes(data.types);
    setTableData(data.values);
    setShouldCalculate(true); // Trigger calculation
  };

  // Handle data submission from AHPInputForm
  const handleAHPFormSubmit = (data: {
    criteria: number[]; // Valid criteria type
    alternatives: number[]; // Valid alternative type
    criteriaComparison: number[][]; // Criteria comparison matrix
    alternativesComparison: number[][][]; // Alternatives comparison matrix
  }) => {
    setWeights(Array(data.alternatives.length).fill(1)); // Initial weights
    setTypes(Array(data.alternatives.length).fill('benefit')); // Assume all alternatives are 'benefit'
    
    // Set tableData with alternative data
    setTableData([data.alternatives]); // Store alternatives
    setCriteriaComparison(data.criteriaComparison); // Set criteria comparison
    setAlternativesComparison(data.alternativesComparison); // Set alternatives comparison
    setShouldCalculate(true); // Trigger calculation
  };

  // Handle reset of inputs, preserving AHP state
  const handleReset = () => {
    console.log("Resetting inputs..."); // Debugging log
    if (selectedMethod === 'ahp') {
      console.log("Resetting AHP comparisons..."); // Debugging log
      setCriteriaComparison(undefined); // Reset criteria comparison
      setAlternativesComparison(undefined); // Reset alternatives comparison
    } else {
      console.log("Resetting other inputs..."); // Debugging log
      setWeights([50, 50]); // Reset weights to default
      setTypes(['benefit', 'benefit']); // Reset types to default
      setTableData([]); // Reset table data
    }
    setShouldCalculate(false); // Reset calculation trigger
  };

  return (
    //<div className="container mx-auto p-4">
    <div className="w-full min-h-screen bg-background">
      <Header />
      {/* Method Selection Component */}
      <MethodSelection onSelectMethod={handleMethodSelect} selectedMethod={selectedMethod} />

      {/* Render InputForm or AHPInputForm based on selected method */}
      {selectedMethod === 'ahp' ? (
        <AHPInputForm onCalculate={handleAHPFormSubmit} onReset={handleReset} />
      ) : (
        <InputForm onCalculate={handleFormSubmit} onReset={handleReset} method={selectedMethod} />
      )}

      {/* Render Calculator component if valid table data and calculation trigger is true */}
      {shouldCalculate && tableData.length > 0 && tableData[0].length > 0 && (
        <Calculator 
          tableData={tableData} 
          weights={weights} 
          types={types} 
          method={selectedMethod} 
          criteriaComparison={criteriaComparison} 
          alternativesComparison={alternativesComparison} 
        />
      )}
      <Footer />
    </div>
  );
};

export default MainPage;
