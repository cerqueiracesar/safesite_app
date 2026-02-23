import pandas as pd
import json
import os
import logging
from datetime import datetime

# Configuração de Logging
os.makedirs('logs', exist_ok=True)
logging.basicConfig(
    filename=f'logs/pipeline_{datetime.now().strftime("%Y%m%d")}.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def run_pipeline():
    input_path = 'src/data/reports.json'
    output_dir = 'data_lake/trusted'
    
    logging.info("🚀 Iniciando execução do pipeline de dados.")
    
    try:
        # 1. Extração
        if not os.path.exists(input_path):
            logging.error(f"Arquivo não encontrado: {input_path}")
            return

        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logging.info(f"Dados carregados: {len(data)} registros encontrados.")

        # 2. Transformação (Flattening)
        processed_reports = []
        for report in data:
            try:
                ai = report.get("aiAnalysis", {})
                processed_reports.append({
                    "id": report.get("id"),
                    "siteId": report.get("siteId"),
                    "timestamp": report.get("timestamp"),
                    "description": report.get("description"),
                    "status": report.get("status"),
                    "riskLevel": ai.get("riskLevel"),
                    "category": ai.get("category"),
                    "dataQualityFlag": "ok" if ai.get("riskLevel") else "missing_ai_data"
                })
            except Exception as e:
                logging.warning(f"Erro ao processar registro {report.get('id')}: {e}")

        # 3. Carga para Parquet
        df = pd.DataFrame(processed_reports)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        os.makedirs(output_dir, exist_ok=True)
        output_file = f"{output_dir}/safety_reports.parquet"
        df.to_parquet(output_file, index=False)
        
        logging.info(f"✅ Pipeline finalizado com sucesso. Arquivo Parquet gerado em {output_file}")
        print(f"✅ Pipeline concluído. Verifique os logs em server/logs/")

    except Exception as e:
        logging.critical(f"Falha catastrófica no pipeline: {e}")

if __name__ == "__main__":
    run_pipeline()