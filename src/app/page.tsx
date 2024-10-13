"use client"; // Pastikan ini berada di bagian atas file agar komponen berjalan pada sisi klien
import React, { useState } from 'react';
import InputForm from '../components/Input'; // Komponen InputForm umum
import AHPInputForm from '../components/AhpInput'; // Impor komponen AHPInputForm khusus AHP
import MethodSelection from '../components/MethodSelection';
import Calculator from '../components/Calculator';

const MainPage: React.FC = () => {
  // State untuk menyimpan metode yang dipilih, default 'wp'
  const [selectedMethod, setSelectedMethod] = useState<'saw' | 'wp' | 'topsis' | 'ahp'>('wp');
  
  // State untuk menyimpan bobot dan tipe (benefit/cost) kriteria, defaultnya 50/50 dan 'benefit'
  const [weights, setWeights] = useState<number[]>([50, 50]);
  const [types, setTypes] = useState<string[]>(['benefit', 'benefit']);
  
  // State untuk menyimpan data alternatif dalam bentuk tabel
  const [tableData, setTableData] = useState<number[][]>([]);
  
  // State untuk memicu perhitungan setelah input data
  const [shouldCalculate, setShouldCalculate] = useState(false);
  
  // State untuk menyimpan perbandingan kriteria dan alternatif khusus untuk AHP
  const [criteriaComparison, setCriteriaComparison] = useState<number[][] | undefined>(undefined);
  const [alternativesComparison, setAlternativesComparison] = useState<number[][][] | undefined>(undefined);

  // Fungsi untuk menangani perubahan metode yang dipilih
  const handleMethodSelect = (method: 'saw' | 'wp' | 'topsis' | 'ahp') => {
    setSelectedMethod(method); // Update metode
    setTableData([]); // Reset data tabel saat metode berubah
    setShouldCalculate(false); // Reset pemicu perhitungan
    setCriteriaComparison(undefined); // Reset perbandingan kriteria AHP
    setAlternativesComparison(undefined); // Reset perbandingan alternatif AHP
  };

  // Fungsi untuk menangani pengiriman data dari InputForm
  const handleFormSubmit = (data: {
    rows: number;
    cols: number;
    weights: number[];
    types: string[];
    values: number[][];
  }) => {
    setWeights(data.weights); // Set bobot kriteria
    setTypes(data.types); // Set tipe kriteria (benefit/cost)
    setTableData(data.values); // Set data alternatif
    setShouldCalculate(true); // Memicu kalkulasi
  };

  // Fungsi untuk menangani pengiriman data dari AHPInputForm
  const handleAHPFormSubmit = (data: {
    criteria: number[];
    alternatives: number[];
    criteriaComparison: number[][];
    alternativesComparison: number[][][];
  }) => {
    setWeights(Array(data.alternatives.length).fill(1)); // Set bobot awal untuk alternatif
    setTypes(Array(data.alternatives.length).fill('benefit')); // Anggap semua alternatif adalah 'benefit'
    
    // Set data tabel dengan data alternatif
    setTableData([data.alternatives]); // Menyimpan alternatif
    setCriteriaComparison(data.criteriaComparison); // Set perbandingan kriteria
    setAlternativesComparison(data.alternativesComparison); // Set perbandingan alternatif
    setShouldCalculate(true); // Memicu kalkulasi
  };

  // Fungsi untuk mereset input, menjaga kondisi untuk AHP
  const handleReset = () => {
    console.log("Mereset input..."); // Log debugging
    if (selectedMethod === 'ahp') {
      console.log("Mereset perbandingan AHP..."); // Log debugging khusus AHP
      setCriteriaComparison(undefined); // Reset perbandingan kriteria AHP
      setAlternativesComparison(undefined); // Reset perbandingan alternatif AHP
    } else {
      console.log("Mereset input lain..."); // Log debugging untuk metode selain AHP
      setWeights([50, 50]); // Reset bobot ke nilai default
      setTypes(['benefit', 'benefit']); // Reset tipe ke nilai default
      setTableData([]); // Reset data tabel
    }
    setShouldCalculate(false); // Reset pemicu kalkulasi
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Decision Support System (DSS)</h1>

      {/* Komponen untuk memilih metode */}
      <MethodSelection onSelectMethod={handleMethodSelect} selectedMethod={selectedMethod} />

      {/* Tampilkan InputForm atau AHPInputForm berdasarkan metode yang dipilih */}
      {selectedMethod === 'ahp' ? (
        <AHPInputForm onCalculate={handleAHPFormSubmit} onReset={handleReset} />
      ) : (
        <InputForm onCalculate={handleFormSubmit} onReset={handleReset} method={selectedMethod} />
      )}

      {/* Tampilkan komponen Calculator jika data tabel valid dan pemicu kalkulasi aktif */}
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
    </div>
  );
};

export default MainPage;
