# SafeSite - Intelligent Data Pipeline for Construction Safety

## 🎯 Project Overview
**SafeSite** is an intelligent data ingestion and processing platform designed to transform unstructured safety reports from construction sites into structured, actionable insights. Originally developed as a Full Stack application, it now serves as a core case study for **Unstructured Data Pipelines** and **Data Quality**.

By leveraging **LLMs (Google Gemini)**, the system performs semantic analysis on raw text to classify risks and recommended actions, feeding a downstream analytical layer for business intelligence.

---

## 🏗️ Data Architecture & Pipeline

### 1. Ingestion Layer (Backend)
* **Source**: Node.js REST API capturing real-time field reports.
* **Processing**: Semantic enrichment via **Google Gemini API** using strict JSON output enforcement for data quality.
* **Storage**: Primary persistence in structured JSON for application state.

### 2. Analytical Layer (Data Engineering)
* **ETL Pipeline**: Python-based engine that performs data flattening and type casting.
* **Storage (Trusted Layer)**: Conversion of raw JSON data into **Apache Parquet** format for optimized analytical performance.
* **Observability**: Integrated logging system to monitor pipeline health and data quality flags.

### 3. Consumption Layer (BI)
* **Interactive Dashboard**: Streamlit-based analytical panel providing real-time KPIs and risk distribution.

[Image of a data engineering architecture diagram showing ingestion, transformation, and visualization layers]

---

## 🛠️ Tech Stack & Toolkit

| Layer | Technologies |
| :--- | :--- |
| **Pipeline Core** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) |
| **Storage** | ![Parquet](https://img.shields.io/badge/Apache_Parquet-634F12?style=flat-square) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) |
| **Orchestration** | ![n8n](https://img.shields.io/badge/n8n-FF6584?style=flat-square&logo=n8n&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |
| **AI/ML** | ![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white) |

---

## 🚀 Analytical Features

* **Schema Enforcement**: Strict validation of AI-generated metadata to prevent data corruption in the analytical layer.
* **Data Flattening**: Automated transformation of nested JSON objects into flat relational structures.
* **Performance Optimization**: Implementation of column-oriented storage (Parquet) reducing analytical query latency.
* **Log Auditing**: Comprehensive logging of ETL runs, recording success rates and record counts for data lineage.

---

## 📁 Data Folder Structure

```text
safesite-app/
├── server/
│   ├── scripts/                    # Data Engineering Layer
│   │   ├── data_pipeline.py        # Python ETL (JSON -> Parquet)
│   │   ├── dashboard.py            # Streamlit BI Dashboard
│   │   └── requirements.txt        # Python Dependencies
│   ├── logs/                       # Pipeline execution logs

⚡ How to Run the Data Pipeline
Prepare Environment:

Bash

cd server
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
Install Dependencies:

Bash

pip install -r scripts/requirements.txt
Run ETL Pipeline:

Bash

python scripts/data_pipeline.py
Launch BI Dashboard:

Bash

streamlit run scripts/dashboard.py
SafeSite v2.0 | Transitioning from Infrastructure Engineering to Data Engineering.