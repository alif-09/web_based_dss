// src/utils/ahp.js
export const calculateAHP = (alternatives, criteria, pairwiseComparisons) => {
    const normalizeMatrix = (matrix) => {
        const sumCols = matrix[0].map((_, colIndex) =>
            matrix.reduce((sum, row) => sum + row[colIndex], 0)
        );
        return matrix.map(row => row.map((value, index) => value / sumCols[index]));
    };

    const calculateWeights = (normalizedMatrix) => {
        return normalizedMatrix.map(row => 
            row.reduce((sum, value) => sum + value, 0) / row.length
        );
    };

    const consistencyCheck = (matrix, weights) => {
        const n = matrix.length;
        const lambdaMax = weights.reduce((sum, weight, i) =>
            sum + weight * matrix[i].reduce((sum, value, j) => sum + value * weights[j], 0), 0
        );
        const ci = (lambdaMax - n) / (n - 1);
        const ri = { 1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24,
                     7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49, 11: 1.51 };
        const cr = ci / ri[n];
        return { cr, ci };
    };

    const createComparisonMatrix = (comparisons) => {
        const matrix = Array.from({ length: criteria.length }, () => Array(criteria.length).fill(1));
        for (let i = 0; i < criteria.length; i++) {
            for (let j = i + 1; j < criteria.length; j++) {
                matrix[i][j] = comparisons[i][j];  // Pairwise comparison value
                matrix[j][i] = 1 / comparisons[i][j];
            }
        }
        return matrix;
    };

    const criteriaMatrix = createComparisonMatrix(pairwiseComparisons.criteria);
    const alternativesMatrices = pairwiseComparisons.alternatives.map((comparisons) => 
        createComparisonMatrix(comparisons)
    );

    const normalizedCriteriaMatrix = normalizeMatrix(criteriaMatrix);
    const criteriaWeights = calculateWeights(normalizedCriteriaMatrix);
    
    const alternativeWeights = alternativesMatrices.map(normalizedMatrix => {
        const normalizedAltMatrix = normalizeMatrix(normalizedMatrix);
        return calculateWeights(normalizedAltMatrix);
    });

    const finalScores = criteriaWeights.map((weight, index) => 
        weight * alternativeWeights[index].reduce((sum, altWeight) => sum + altWeight, 0)
    );

    // Consistency check for criteria
    const { cr: criteriaCR } = consistencyCheck(criteriaMatrix, criteriaWeights);
    if (criteriaCR >= 0.1) {
        console.warn("Failed consistency check for criteria");
    }

    // Consistency check for alternatives
    alternativeWeights.forEach((weights, index) => {
        const { cr: altCR } = consistencyCheck(alternativesMatrices[index], weights);
        if (altCR >= 0.1) {
            console.warn(`Failed consistency check for alternatives of criterion ${criteria[index]}`);
        }
    });

    return {
        criteriaWeights,
        finalScores,
        consistencyResults: { criteriaCR }
    };
};
