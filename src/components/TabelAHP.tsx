import React from 'react';

const TabelAHP = ({ criteriaWeights, finalScores, consistencyResults }) => {
    return (
        <div>
            <h2>Hasil AHP</h2>

            <h3>Hasil Akhir Kriteria:</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Kriteria</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Bobot</th>
                    </tr>
                </thead>
                <tbody>
                    {criteriaWeights.map((weight, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Kriteria {index + 1}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{weight.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Hasil Akhir Alternatif:</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Alternatif</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Skor</th>
                    </tr>
                </thead>
                <tbody>
                    {finalScores.map((result) => (
                        <tr key={result.alternative}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.alternative}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.score.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Konsistensi:</h3>
            <div>
                <p>Konsistensi Kriteria: {consistencyResults.criteriaCR?.toFixed(4) || 'N/A'}</p>
                <p>Indeks Konsistensi: {consistencyResults.criteriaCI?.toFixed(4) || 'N/A'}</p>
            </div>
        </div>
    );
};

export default TabelAHP;
