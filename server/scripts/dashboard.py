import streamlit as st
import pandas as pd

# Configuração da página
st.set_page_config(page_title="SafeSite Data Insights", layout="wide")

st.title("📊 SafeSite - Painel Analítico de Segurança")
st.markdown("Visualização de dados estruturados extraídos via IA (Gemini).")

# 1. Carregar o arquivo Parquet (O output do seu pipeline de engenharia)
try:
    df = pd.read_parquet("data_lake/trusted/safety_reports.parquet")
    
    # Metadados de visualização
    st.sidebar.header("Filtros")
    status_filter = st.sidebar.multiselect("Status do Relato", df['status'].unique(), default=df['status'].unique())
    
    # Filtrar dados
    df_filtered = df[df['status'].isin(status_filter)]

    # 2. Métricas Principais (KPIs)
    col1, col2, col3 = st.columns(3)
    col1.metric("Total de Relatos", len(df_filtered))
    col2.metric("Nível Crítico", len(df_filtered[df_filtered['riskLevel'] == 'critical']))
    col3.metric("Casos Resolvidos", len(df_filtered[df_filtered['status'] == 'resolved']))

    # 3. Gráficos
    c1, c2 = st.columns(2)

    with c1:
        st.subheader("Distribuição por Nível de Risco")
        risk_counts = df_filtered['riskLevel'].value_counts()
        st.bar_chart(risk_counts)

    with c2:
        st.subheader("Categorias de Incidentes")
        cat_counts = df_filtered['category'].value_counts()
        st.bar_chart(cat_counts)

    # 4. Tabela de Dados Brutos (Flattened)
    st.subheader("Exploração de Dados (Trusted Layer)")
    st.dataframe(df_filtered)

except FileNotFoundError:
    st.error("Arquivo Parquet não encontrado. Execute o script de pipeline primeiro!")

st.divider()
st.subheader("📥 Exportação para Gestão")

# Função para converter o dataframe filtrado para Excel em memória
@st.cache_data
def convert_df(df):
    return df.to_csv(index=False).encode('utf-8')

csv = convert_df(df_filtered)

st.download_button(
    label="Baixar Relatório Filtrado (CSV)",
    data=csv,
    file_name='relatorio_seguranca_safesite.csv',
    mime='text/csv',
)

st.info("💡 Dica: Use este arquivo para importar dados no Excel ou PowerBI para relatórios semanais.")