import React, { useState, useEffect } from "react";

interface AHPInputFormProps {
  onCalculate: (data: {
    criteria: string[];
    alternatives: string[];
    pairwiseComparison: {
      criteria: number[][];
      alternatives: number[][][];
    };
  }) => void;
}

const AHPInputForm: React.FC<AHPInputFormProps> = ({ onCalculate }) => {
  const [numCriteria, setNumCriteria] = useState(2);
  const [numAlternatives, setNumAlternatives] = useState(2);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [criteriaComparison, setCriteriaComparison] = useState<number[][]>([]);
  const [alternativesComparison, setAlternativesComparison] = useState<number[][][]>([]);

  useEffect(() => {
    generateCriteria();
    generateAlternatives();
    generateCriteriaComparison();
    generateAlternativesComparison();
  }, [numCriteria, numAlternatives]);

  const generateCriteria = () => {
    const newCriteria = Array(numCriteria).fill("");
    setCriteria(newCriteria);
  };

  const generateAlternatives = () => {
    const newAlternatives = Array(numAlternatives).fill("");
    setAlternatives(newAlternatives);
  };

  const generateCriteriaComparison = () => {
    const newComparison = Array(numCriteria)
      .fill(0)
      .map(() => Array(numCriteria).fill(1));
    setCriteriaComparison(newComparison);
  };

  const generateAlternativesComparison = () => {
    const newAlternativesComparisons = Array(numCriteria)
      .fill(0)
      .map(() => Array(numAlternatives).fill(0).map(() => Array(numAlternatives).fill(1)));
    setAlternativesComparison(newAlternativesComparisons);
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCriteria = [...criteria];
    newCriteria[index] = e.target.value;
    setCriteria(newCriteria);
  };

  const handleAlternativesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = e.target.value;
    setAlternatives(newAlternatives);
  };

  const handleCriteriaComparisonChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const newComparison = [...criteriaComparison];
    newComparison[rowIndex][colIndex] = Number(e.target.value);
    newComparison[colIndex][rowIndex] = 1 / Number(e.target.value); // Reciprocal
    setCriteriaComparison(newComparison);
  };

  const handleAlternativesComparisonChange = (e: React.ChangeEvent<HTMLInputElement>, criterionIndex: number, rowIndex: number, colIndex: number) => {
    const newComparison = [...alternativesComparison];
    newComparison[criterionIndex][rowIndex][colIndex] = Number(e.target.value);
    newComparison[criterionIndex][colIndex][rowIndex] = 1 / Number(e.target.value); // Reciprocal
    setAlternativesComparison(newComparison);
  };

  const handleReset = () => {
    generateCriteria();
    generateAlternatives();
    generateCriteriaComparison();
    generateAlternativesComparison();
  };

  const handleCalculate = () => {
    if (criteria.some(c => c === "") || alternatives.some(a => a === "")) {
      alert("Please fill all input fields before calculating.");
      return;
    }
    onCalculate({
      criteria,
      alternatives,
      pairwiseComparison: {
        criteria: criteriaComparison,
        alternatives: alternativesComparison,
      },
    });
  };

  return (
    <div className="space-y-4 flex flex-col">
      {/* Criteria Input */}
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
        {criteria.map((c, index) => (
          <input
            key={index}
            type="text"
            value={c}
            onChange={(e) => handleCriteriaChange(e, index)}
            placeholder={`Criterion ${index + 1}`}
            className="block w-full mt-2 p-2 bg-gray-700 text-white focus:outline-none"
          />
        ))}
      </div>

      {/* Alternatives Input */}
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
        {alternatives.map((a, index) => (
          <input
            key={index}
            type="text"
            value={a}
            onChange={(e) => handleAlternativesChange(e, index)}
            placeholder={`Alternative ${index + 1}`}
            className="block w-full mt-2 p-2 bg-gray-700 text-white focus:outline-none"
          />
        ))}
      </div>

      {/* Pairwise Comparison Table for Criteria */}
      <div>
        <h2 className="text-lg font-semibold">Pairwise Comparison for Criteria</h2>
        <table className="min-w-full text-sm text-gray-400 text-center">
          <thead>
            <tr>
              <th className="px-4 py-2">Criteria</th>
              {criteria.map((c, index) => (
                <th key={index} className="px-4 py-2">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteriaComparison.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-4 py-2">{criteria[rowIndex]}</td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={cell}
                      onChange={(e) => handleCriteriaComparisonChange(e, rowIndex, colIndex)}
                      className="w-full bg-gray-700 text-white focus:outline-none"
                    />
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
        {criteria.map((criterion, criterionIndex) => (
          <div key={criterionIndex} className="mt-4">
            <h3 className="text-md font-semibold">{criterion}</h3>
            <table className="min-w-full text-sm text-gray-400 text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">Alternatives</th>
                  {alternatives.map((a, index) => (
                    <th key={index} className="px-4 py-2">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alternativesComparison[criterionIndex].map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="px-4 py-2">{alternatives[rowIndex]}</td>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="px-4 py-2">
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={cell}
                          onChange={(e) => handleAlternativesComparisonChange(e, criterionIndex, rowIndex, colIndex)}
                          className="w-full bg-gray-700 text-white focus:outline-none"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
        <button
          onClick={handleCalculate}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default AHPInputForm;
