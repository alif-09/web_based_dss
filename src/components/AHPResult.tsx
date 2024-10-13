import React from 'react';
import Table from './Table'; // Sesuaikan dengan path yang benar

interface AHPResultProps {
    steps: { title: string; data: any }[]; // Ubah tipe data ke any untuk fleksibilitas
    result: {
        criteriaWeights: number[];
        finalScores: { alternative: string; score: number }[];
    };
    consistencyResults: {
        criteriaCR: number | null;
        criteriaCI: number | null;
    };
}

const AHPResult: React.FC<AHPResultProps> = ({ steps, result, consistencyResults }) => {
    const criteriaHeaders = ['Criteria', 'Weight'];
    const alternativeHeaders = ['Alternative', 'Score'];

    // Fungsi untuk merender data langkah
    const renderStepData = (title: string, data: any) => {
        switch (title) {
            case "Pairwise Comparison Matrices":

                const criteriaMatrix = data.criteriaMatrix;
                const alternativesMatrices = data.alternativesMatrices;
                return (
                    <>
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Pairwise Comparison Matrices</h3>
                        <Table
                            headers={criteriaMatrix[0].map((_: any, index: number) => `Criterion ${index + 1}`)}
                            // Header untuk kriteria
                            data={criteriaMatrix} // Data matriks perbandingan kriteria
                            stepTitle="Criteria Comparison Matrices"
                        />
                        <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>Alternative Comparison Matrices</h4>
                        {alternativesMatrices.map((matrix: any, index: any) => (
                            <div key={index}>
                                <Table
                                    headers={matrix[0].map((_: any, idx: any) => `Alternative ${idx + 1}`)} // Header untuk alternatif
                                    data={matrix} // Data matriks perbandingan alternatif
                                    stepTitle={`Alternatives for Criterion ${index + 1}`}
                                />
                            </div>
                        ))}
                    </>
                );
            case "Normalized Matrices":
                const normalizedCriteriaMatrix = data.normalizedCriteriaMatrix;
                const normalizedAlternativesMatrices = data.normalizedAlternativesMatrices;
                return (
                    <>
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Normalized Matrices</h3>
                        <Table
                            headers={normalizedCriteriaMatrix[0].map((_: any, index: any) => `Criterion ${index + 1}`)}
                            data={normalizedCriteriaMatrix}
                            stepTitle="Normalized Criteria Matrices"
                        />

                        {normalizedAlternativesMatrices.map((matrix: any, index: any) => (
                            <div key={index}>
                                <Table
                                    headers={matrix[0].map((_: any, idx: any) => `Alternative ${idx + 1}`)}
                                    data={matrix}
                                    stepTitle={`Alternatives for Criterion ${index + 1}`}
                                />
                            </div>
                        ))}
                    </>
                );
            case "Calculated Weights":
                const criteriaWeights = data.criteriaWeights;
                const alternativeWeights = data.alternativeWeights;

                // Header untuk tabel: kriteria menjadi header kolom
                const alternativeWeightHeaders = ['Alternative', ...criteriaWeights.map((_: any, index: any) => `Criterion ${index + 1}`)];

                // Data tabel: bobot alternatif untuk setiap kriteria
                const alternativeWeightData = alternativeWeights[0].map((_: any, altIndex: any) => {
                    return [
                        `Alternative ${altIndex + 1}`, // Nama alternatif pada kolom pertama
                        ...alternativeWeights.map((weights: any) => weights[altIndex].toFixed(4)) // Bobot alternatif pada kolom berikutnya
                        // Bobot alternatif pada kolom berikutnya
                    ];
                });

                return (
                    <>
                        <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>Weights Results</h4>

                        <Table
                            headers={alternativeWeightHeaders}
                            data={alternativeWeightData}
                            stepTitle="Alternatives Weight for Each Criterion"
                        />
                        <div><br /> </div>
                        <Table
                            headers={['Criterion', 'Weight']}
                            data={criteriaWeights.map((weight: any, index: any) => [`Criterion ${index + 1}`, weight.toFixed(4)])}
                            stepTitle="Criterion Weights"
                        />
                    </>
                );

            case "Final Scores":
                return (
                    <Table
                        headers={['Rank', 'Alternative', 'Score']} // Menambahkan 'Rank' ke header
                        data={result.finalScores.map((alt, index) => [
                            index + 1, // Peringkat dimulai dari 1
                            alt.alternative,
                            alt.score.toFixed(4)
                        ])}
                        stepTitle="Ranking Results"
                    />
                );

            case "Consistency Check":
                const { criteriaCR, criteriaCI } = consistencyResults;
                const consistencyMessage = criteriaCR === null
                    ? "Consistency data is not available."
                    : criteriaCR === 0
                        ? "The criteria matrix is consistent."
                        : criteriaCR <= 0.1
                            ? "The criteria matrix is reasonably consistent."
                            : "The criteria matrix is highly inconsistent.";


                return (
                    <>
                        <Table
                            headers={['Consistency Ratio (CR)', 'Consistency Index (CI)']}
                            data={[
                                [
                                    criteriaCR !== null ? criteriaCR.toFixed(4) : 'Data not available',
                                    criteriaCI !== null ? criteriaCI.toFixed(4) : 'Data not available'
                                ],
                                ["Consistency", consistencyMessage] // Menambahkan baris baru dengan pesan konsistensi
                            ]}
                            stepTitle="Consistency"
                        />
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className='container mx-auto px-5 ml-15 mb-4'>
            {steps.map((step, index) => (
                <div key={index}>
                    <h4> <br></br></h4>
                    {renderStepData(step.title, step.data)}
                </div>
            ))}
        </div>

    );
};

export default AHPResult;
