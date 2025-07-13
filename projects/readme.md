# Predicting Pathological Complete Response (pCR) Using Gene Expression Data

## Overview
This project aims to develop machine learning models to predict pathological complete response (pCR) in breast cancer patients using gene expression data. The performance of these models is benchmarked against the established PAM50 predictor (Prosigna). The analysis includes logistic regression as a baseline, with more flexible models (Random Forest and Gradient Boosting Machine) to improve predictive performance.

## Data Sources
- **18 clinical studies** with binary pCR outcomes
- **Three main components**:
  - `pCR`: List of 18 binary response vectors (0 or 1)
  - `XX_pCR`: List of 18 expression matrices (10,115 biomarkers × patients)
  - `pam50_recur`: Benchmark prediction vectors
- **Test/Train Split**:
  - Study 10 as test set (largest dataset with PAM50 predictions)
  - Remaining studies as training set

## Methods

### Data Preprocessing
- Identified common genes across all datasets
- Filtered studies to include only shared genes
- Batch effect correction:
  - Normalized gene expression using MKI67 (proliferation marker)
  - Subtracted MKI67 expression
  - Scaled by standard deviation of MKI67 expression in each study
- Preserved original data structure post-normalization

### Feature Engineering
- PCA to generate features for each gene
- Rigorous feature selection to identify informative biomarkers

### Modeling Approach
1. **Baseline Model**: Logistic Regression
2. **Model II**: Random Forest Classifier
3. **Model III**: Gradient Boosting Machine (GBM)
- Employed leave-one-study-out cross-validation during training

### Evaluation
- Compared against PAM50 benchmark using AUC metrics
- Assessed generalization through train-test AUC gaps

## Key Findings
- **Performance Comparison**:
  
  | Model               | Train AUC | Test AUC | Gap    |
  |---------------------|-----------|----------|--------|
  | PAM50 benchmark     | 0.524     | 0.571    | -0.047 |
  | Logistic Regression | 0.674     | 0.754    | -0.079 |
  | Random Forest       | 0.820     | 0.715    | 0.105  |
  | GBM                 | 0.730     | 0.753    | -0.023 |

- Logistic regression on our features outperformed Prosigna's PAM50 features
- More flexible models (GBM) showed improved performance while maintaining good generalization
- GBM demonstrated particularly strong generalization (test AUC slightly higher than train AUC)

## Files
- `analysis.ipynb`: Main analysis notebook containing:
  - Exploratory Data Analysis
  - Feature Selection
  - Model Training and Evaluation
  - Benchmarking against PAM50
- `data/`: Processed datasets
- `results/`: Output files and visualizations

## Limitations
- Logistic regression only provides appropriate fits when the true response is a logistic function of the features
- Potential overfitting with flexible models (particularly Random Forest, as evidenced by the large train-test AUC gap)
- Dependence on quality and consistency of gene expression measurements across studies
