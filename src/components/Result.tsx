"use client";
import React from 'react';
import Table from './Table'; // Import the Table component

interface ResultProps {
  steps: { title: string; data: any }[];
}

const Result: React.FC<ResultProps> = ({ steps }) => {

  // Fungsi untuk merender tabel sesuai langkah
  const renderStepData = (title: string, data: any) => {
    switch (title) {
      case "Input Data":
        return <div></div>;

      case "Normalized Weights":
        return (
          <Table
            headers={["Criteria", "Weights"]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((weight: number, index: number) => [
              `C${index + 1}`, weight.toFixed(4)
            ])}
          />
        );

      case "Normalized Matrix":
        return (
          <Table
            headers={["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((row: any, rowIndex: number) => [
              `A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))
            ])}
          />
        );
        case "Weighted Matrix":
        return (
          <Table
            headers={["Item", ...data[0].map((_: any, index: number) => `C${index + 1}`)]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((row: any, rowIndex: number) => [
              `A${rowIndex + 1}`, ...row.map((cell: any) => cell.toFixed(4))
            ])}
          />
        );
      case "Weighted Sum":
        return (
          <Table
            headers={["Item", "Value"]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((value: number, index: number) => [
              `A${index + 1}`, value.toFixed(4)
            ])}
          />
        );

      case "Final Ranking":
        return (
          <Table
            headers={["Item", "Value", "Rank"]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((item: any) => [
              `A${item.index}`, item.value.toFixed(4), item.rank
            ])}
          />
        );
      case "S Values":
        return (
          <Table
            headers={["Item", "S Value"]}
            stepTitle={title} // Menambahkan judul langkah
            data={data.map((value: number, index: number) => [
              `A${index + 1}`, value.toFixed(4)
            ])}
          />
        );
      default:
        return <div>No data available</div>;
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Calculation Steps</h2>
      {steps.map((step, index) => (
        <div key={index} className="mb-6">
          {renderStepData(step.title, step.data)}
        </div>
      ))}
    </div>
  );
};

export default Result;
