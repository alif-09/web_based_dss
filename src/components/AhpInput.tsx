import React, { useState, useEffect } from "react";

interface AHPInputFormProps {
  onCalculate: (data: {
    criteria: number[][];
    alternatives: number[][][];
    criteriaComparison: number[][];
    alternativesComparison: number[][][];
  }) => void;
  onReset: () => void;
  method: string;
  isAHP?: boolean; // New prop to indicate if AHP is selected
  onAHPDataChange?: (data: number[][]) => void;
}

const AHPInputForm: React.FC<AHPInputFormProps> = ({ onCalculate, onReset }) => {
  const [numCriteria, setNumCriteria] = useState(2);
  const [numAlternatives, setNumAlternatives] = useState(2);
  const [criteriaComparison, setCriteriaComparison] = useState<number[][]>([]);
  const [alternativesComparison, setAlternativesComparison] = useState<number[][][]>([]);
  const [results, setResults] = useState(null); // State for AHP results

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
    const newComparison = Array.from({ length: numCriteria }, (_, i) =>
      Array.from({ length: numCriteria }, (_, j) => (i === j ? 1 : 0))
    );

    for (let i = 0; i < numCriteria; i++) {
      for (let j = 0; j < numCriteria; j++) {
        if (i !== j) {
          newComparison[i][j] = criteriaComparison[i]?.[j] || 1; // Maintain previous value or set to 1 if undefined
          newComparison[j][i] = 1 / newComparison[i][j]; // Maintain reciprocal
        }
      }
    }

    setCriteriaComparison(newComparison);
  };

  const generateAlternativesComparison = () => {
    const newAlternativesComparisons = Array.from({ length: numCriteria }, (_, criterionIndex) => {
      return Array.from({ length: numAlternatives }, (_, i) =>
        Array.from({ length: numAlternatives }, (_, j) => (i === j ? 1 : 0))
      ).map((row, rowIndex) => {
        for (let colIndex = 0; colIndex < numAlternatives; colIndex++) {
          if (rowIndex !== colIndex) {
            row[colIndex] = alternativesComparison[criterionIndex]?.[rowIndex]?.[colIndex] || 1; // Maintain previous value or set to 1 if undefined
            row[colIndex] = row[colIndex]; // Maintain reciprocal
          }
        }
        return row;
      });
    });

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
    setNumCriteria(2); // Reset to the initial number of criteria
    setNumAlternatives(2); // Reset to the initial number of alternatives

    // Reset criteria comparison to default values
    const defaultCriteriaComparison = Array.from({ length: 2 }, (_, i) =>
      Array.from({ length: 2 }, (_, j) => (i === j ? 1 : 1))
    );
    setCriteriaComparison(defaultCriteriaComparison);

    // Reset alternatives comparison to default values
    const defaultAlternativesComparisons = Array.from({ length: 2 }, (_, criterionIndex) =>
      Array.from({ length: 2 }, (_, i) =>
        Array.from({ length: 2 }, (_, j) => (i === j ? 1 : 1))
      )
    );
    setAlternativesComparison(defaultAlternativesComparisons);

    // Reset results to null or any default state
    setResults(null); // Clear AHP calculation results
    onReset();
  };


  const handleCalculate = () => {
    if (criteriaComparison.length === 0 || alternativesComparison.length === 0) {
      alert("Silakan isi semua perbandingan sebelum menghitung!");
      return;
    }

    onCalculate({
      criteria: criteriaComparison,
      alternatives: alternativesComparison,
      criteriaComparison: criteriaComparison || [],
      alternativesComparison: alternativesComparison || [],
    });
  };

  return (
    <div className="space-y-4 ml-5 flex flex-col">
      <div className='w-full container mx-auto ml-10'>
        <table className="max-w-20">
          <tbody>
            {/* Criteria */}
            <tr>
              <td className="text-left pr-2">Criteria</td>
              <td className="pr-2">:</td>
              <td className="flex items-center space-x-4">
                <button
                  onClick={() => setNumCriteria(Math.max(2, numCriteria - 1))}
                  className={`px-2 py-1 rounded ${numCriteria <= 2
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  disabled={numCriteria <= 2}
                >
                  -
                </button>
                <span>{numCriteria}</span>
                <button
                  onClick={() => setNumCriteria(Math.min(10, numCriteria + 1))}
                  className={`px-2 py-1 rounded ${numCriteria >= 10
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  disabled={numCriteria >= 10}
                >
                  +
                </button>
              </td>
            </tr>

            {/* Alternatives */}
            <tr>
              <td className="text-left pr-2">Alternatives</td>
              <td className="pr-2">:</td>
              <td className="flex items-center space-x-4">
                <button
                  onClick={() => setNumAlternatives(Math.max(2, numAlternatives - 1))}
                  className={`px-2 py-1 rounded ${numAlternatives <= 2
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  disabled={numAlternatives <= 2}
                >
                  -
                </button>
                <span>{numAlternatives}</span>
                <button
                  onClick={() => setNumAlternatives(Math.min(10, numAlternatives + 1))}
                  className={`px-2 py-1 rounded ${numAlternatives >= 10
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  disabled={numAlternatives >= 10}
                >
                  +
                </button>
              </td>
            </tr>
          </tbody>
        </table>

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
            <tbody className='bg-white'>
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
                <tbody className='bg-white'>
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

        <div className="flex justify mt-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none mr-2"
          >
            Reset
          </button>
          <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md focus:outline-none"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AHPInputForm;
