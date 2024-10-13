import React from 'react';
import { calculateSAW } from '../utils/saw';
import { calculateWP } from '../utils/wp';
import { calculateTOPSIS } from '../utils/topsis';
import { calculateAHP } from '../utils/ahp';
import Result from './Result';
import AHPResult from './AHPResult';

interface CalculatorProps {
  tableData: number[][]; // Data tabel untuk alternatif
  weights: number[]; // Bobot untuk kriteria
  types: string[]; // Tipe untuk kriteria (benefit/cost)
  method: 'saw' | 'wp' | 'topsis' | 'ahp'; // Metode yang dipilih
  criteriaComparison?: number[][]; // Matriks perbandingan kriteria untuk AHP
  alternativesComparison?: number[][][]; // Matriks perbandingan alternatif untuk setiap kriteria
  criteria?: string[]; // Daftar kriteria
  alternatives?: string[]; // Daftar alternatif
}

const Calculator: React.FC<CalculatorProps> = ({ 
  tableData, 
  weights, 
  types, 
  method, 
  criteriaComparison, 
  alternativesComparison,
  criteria = [], 
  alternatives = [],
}) => {
  const [result, setResult] = React.useState<any>(null);

  React.useEffect(() => {
    if (tableData.length > 0 && weights.length > 0 && types.length > 0) {
      const inputData = {
        rows: tableData.length,
        cols: tableData[0]?.length || 0,
        weights,
        types,
        values: tableData,
      };

      let calculationResult;

      switch (method) {
        case 'saw':
          calculationResult = calculateSAW(inputData);
          break;
        case 'wp':
          calculationResult = calculateWP(inputData);
          break;
        case 'topsis':
          calculationResult = calculateTOPSIS(inputData);
          break;
        case 'ahp':
          if (criteriaComparison && alternativesComparison) {
            if (criteriaComparison.length === 0 || alternativesComparison.length === 0) {
              setResult(null); // Mengatur result ke null jika input tidak valid
              return; // Hentikan eksekusi lebih lanjut
            }
            calculationResult = calculateAHP(alternatives, criteria, {
              criteria: criteriaComparison,
              alternatives: alternativesComparison,
            });
          } else {
            console.error("AHP requires criteriaComparison and alternativesComparison");
            setResult(null); // Mengatur result ke null jika input tidak valid
            return; // Hentikan eksekusi lebih lanjut
          }
          break;
        default:
          calculationResult = null;
          break;
      }

      setResult(calculationResult); // Mengatur hasil perhitungan
    }
  }, [tableData, weights, types, method, criteriaComparison, alternativesComparison]);

  // Mengembalikan hasil perhitungan jika ada
  if (!result) return null; // Jika tidak ada hasil, tidak perlu render apa pun

  // Jika ada hasil, render sesuai metode
  return method === 'ahp' ? (
    <AHPResult
      steps={result.steps}
      result={result.result}
      consistencyResults={result.consistencyResults}
    />
  ) : (
    <Result steps={result.steps} />
  );
};

export default Calculator;