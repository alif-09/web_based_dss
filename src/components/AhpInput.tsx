import React, { useState, useEffect } from "react";

interface AHPInputFormProps {
  onCalculate: (data: {
    criteria: number[][];
    alternatives: number[][][];
    criteriaComparison: number[][]; // Tambahkan ini
    alternativesComparison: number[][][]; // Tambahkan ini
  }) => void;
}

const AHPInputForm: React.FC<AHPInputFormProps> = ({ onCalculate }) => {
  const [numCriteria, setNumCriteria] = useState(2);
  const [numAlternatives, setNumAlternatives] = useState(2);
  const [criteriaComparison, setCriteriaComparison] = useState<number[][]>([]);
  const [alternativesComparison, setAlternativesComparison] = useState<number[][][]>([]);

  const comparisonOptions = [
    { value: 1, label: "Equal importance" },
    { value: 2, label: "Slightly more important" },
    { value: 3, label: "Moderately more important" },
    { value: 4, label: "Slightly stronger importance" },
    { value: 5, label: "Strong importance" },
    { value: 6, label: "Slightly very strong importance" },
    { value: 7, label: "Very strong importance" },
    { value: 8, label: "Slightly absolute importance" },
    { value: 9, label: "Absolute importance" },
  ];

  useEffect(() => {
    generateCriteriaComparison();
    generateAlternativesComparison();
  }, [numCriteria, numAlternatives]);

  const generateCriteriaComparison = () => {
    const newComparison = Array(numCriteria)
      .fill(0)
      .map(() => Array(numCriteria).fill(1));
    setCriteriaComparison(newComparison);
  };

  const generateAlternativesComparison = () => {
    const newAlternativesComparisons = Array(numCriteria)
      .fill(0)
      .map(() => Array(numAlternatives)
        .fill(0)
        .map(() => Array(numAlternatives).fill(1)));
    setAlternativesComparison(newAlternativesComparisons);
  };

  const handleCriteriaComparisonChange = (e: React.ChangeEvent<HTMLSelectElement>, rowIndex: number, colIndex: number) => {
    const newComparison = [...criteriaComparison];
    newComparison[rowIndex][colIndex] = Number(e.target.value);
    newComparison[colIndex][rowIndex] = 1 / Number(e.target.value); // Reciprocal
    setCriteriaComparison(newComparison);
  };

  const handleAlternativesComparisonChange = (e: React.ChangeEvent<HTMLSelectElement>, criterionIndex: number, rowIndex: number, colIndex: number) => {
    const newComparison = [...alternativesComparison];
    newComparison[criterionIndex][rowIndex][colIndex] = Number(e.target.value);
    newComparison[criterionIndex][colIndex][rowIndex] = 1 / Number(e.target.value); // Reciprocal
    setAlternativesComparison(newComparison);
  };

  const handleReset = () => {
    generateCriteriaComparison();
    generateAlternativesComparison();
  };

  const handleCalculate = () => {
    if (criteriaComparison.length === 0 || alternativesComparison.length === 0) {
      alert("Silakan isi semua perbandingan sebelum menghitung!");
      return;
    }
    
    // Pastikan bahwa data criteria dan alternatives juga disediakan
    onCalculate({
      criteria: criteriaComparison,
      alternatives: alternativesComparison,
      criteriaComparison: criteriaComparison || [],
      alternativesComparison: alternativesComparison || [],
    });
  };

  return (
    <div className="space-y-4 flex flex-col">
      {/* Criteria */}
      <div>
        <h2 className="text-lg font-semibold">Criteria</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setNumCriteria(Math.max(2, numCriteria - 1))}
            className={`px-2 py-1 rounded ${numCriteria <= 2 ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-800 text-white"}`}
          >
            -
          </button>
          <span>{numCriteria}</span>
          <button
            onClick={() => setNumCriteria(Math.min(10, numCriteria + 1))}
            className={`px-2 py-1 rounded ${numCriteria >= 10 ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-800 text-white"}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Alternatives */}
      <div>
        <h2 className="text-lg font-semibold">Alternatives</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setNumAlternatives(Math.max(2, numAlternatives - 1))}
            className={`px-2 py-1 rounded ${numAlternatives <= 2 ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-800 text-white"}`}
          >
            -
          </button>
          <span>{numAlternatives}</span>
          <button
            onClick={() => setNumAlternatives(Math.min(10, numAlternatives + 1))}
            className={`px-2 py-1 rounded ${numAlternatives >= 10 ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-800 text-white"}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Pairwise Comparison Table for Criteria */}
      <div>
        <h2 className="text-lg font-semibold">Pairwise Comparison for Criteria</h2>
        <table className="min-w-full text-sm text-gray-900 dark:text-gray-100 text-center divide-x divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-4 py-2">Criteria</th>
              {Array.from({ length: numCriteria }, (_, index) => (
                <th key={index} className="px-4 py-2">{`C${index + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteriaComparison.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-4 py-2">{`C${rowIndex + 1}`}</td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    {rowIndex < colIndex ? (
                      <select
                        value={criteriaComparison[rowIndex][colIndex]}
                        onChange={(e) => handleCriteriaComparisonChange(e, rowIndex, colIndex)}
                        className="bg-gray-700 text-white"
                      >
                        {comparisonOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{cell}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pairwise Comparison Table for Alternatives */}
      <div>
        <h2 className="text-lg font-semibold">Pairwise Comparison for Alternatives</h2>
        {Array.from({ length: numCriteria }, (_, criterionIndex) => (
          <div key={criterionIndex} className="mt-4">
            <h3 className="text-md font-semibold">{`Criterion C${criterionIndex + 1}`}</h3>
            <table className="min-w-full text-sm text-gray-900 dark:text-gray-100 text-center divide-x divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-2">Alternatives</th>
                  {Array.from({ length: numAlternatives }, (_, index) => (
                    <th key={index} className="px-4 py-2">{`A${index + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alternativesComparison[criterionIndex]?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="px-4 py-2">{`A${rowIndex + 1}`}</td>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="px-4 py-2">
                        {rowIndex < colIndex ? (
                          <select
                            value={alternativesComparison[criterionIndex][rowIndex][colIndex]}
                            onChange={(e) => handleAlternativesComparisonChange(e, criterionIndex, rowIndex, colIndex)}
                            className="bg-gray-700 text-white"
                          >
                            {comparisonOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={handleReset} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded">
          Reset
        </button>
        <button onClick={handleCalculate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          Calculate
        </button>
      </div>
    </div>
  );
};

export default AHPInputForm;