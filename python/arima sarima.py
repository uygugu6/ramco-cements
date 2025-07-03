import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet
import warnings

warnings.filterwarnings("ignore")

st.set_page_config(layout="wide")
st.title("📈 ARIMA, SARIMA, Prophet Forecasting")

# Upload Excel File
uploaded_file = st.file_uploader("Upload Excel file", type=["xlsx"])

if uploaded_file:
    try:
        df = pd.read_excel(uploaded_file)
        df = df.fillna(method='ffill').fillna(method='bfill')
        st.success("✅ File uploaded and read successfully.")

        st.write("### Preview of Data")
        st.dataframe(df.head())

        columns = df.columns.tolist()
        x_col = st.selectbox("📅 Select X-axis (Date)", options=columns)
        y_col = st.selectbox("📊 Select Y-axis (Value)", options=columns, index=1 if len(columns) > 1 else 0)
        plot_type = st.selectbox("📐 Select Plot Type", options=["Line", "Bar", "Scatter"])
        forecast_model = st.selectbox("🧠 Choose Forecasting Model", ["None", "ARIMA", "SARIMA", "Prophet"])
        forecast_steps = st.slider("📆 Forecast Days", min_value=7, max_value=90, value=30)

        if st.button("Generate Plot"):
            try:
                data = df[[x_col, y_col]].copy()
                data[x_col] = pd.to_datetime(data[x_col], errors='coerce')
                data.dropna(subset=[x_col, y_col], inplace=True)
                data.sort_values(by=x_col, inplace=True)

                fig, ax = plt.subplots(figsize=(12, 6))

               
                if plot_type == "Line":
                    ax.plot(data[x_col], data[y_col], label="Original", marker='o')
                elif plot_type == "Bar":
                    ax.bar(data[x_col], data[y_col], label="Original")
                elif plot_type == "Scatter":
                    ax.scatter(data[x_col], data[y_col], label="Original")

                if forecast_model != "None" and plot_type != "Bar":
                    series = data.set_index(x_col)[y_col]
                    series = series.asfreq('D')
                    series = series.interpolate()

                    if len(series) < 10:
                        st.warning("⚠ Not enough data for forecasting. Minimum 10 points required.")
                    else:
                        future_dates = pd.date_range(start=series.index[-1] + pd.Timedelta(days=1), periods=forecast_steps)

                        if forecast_model == "ARIMA":
                            model = ARIMA(series, order=(2, 1, 2))
                            model_fit = model.fit()
                            forecast = model_fit.forecast(steps=forecast_steps)
                            ax.plot(future_dates, forecast, label="ARIMA Forecast", linestyle='--', color='red')

                        elif forecast_model == "SARIMA":
                            model = SARIMAX(series, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
                            model_fit = model.fit()
                            forecast = model_fit.forecast(steps=forecast_steps)
                            ax.plot(future_dates, forecast, label="SARIMA Forecast", linestyle='--', color='green')

                        elif forecast_model == "Prophet":
                            prophet_df = data[[x_col, y_col]].rename(columns={x_col: "ds", y_col: "y"})
                            model = Prophet()
                            model.fit(prophet_df)

                            future = model.make_future_dataframe(periods=forecast_steps)
                            forecast_df = model.predict(future)

                            ax.plot(forecast_df["ds"], forecast_df["yhat"], label="Prophet Forecast", color='orange', linestyle="--")
                            ax.fill_between(forecast_df["ds"], forecast_df["yhat_lower"], forecast_df["yhat_upper"],
                                            color='orange', alpha=0.3, label="Confidence Interval")

                ax.set_title(f"{plot_type} Plot of {y_col} vs {x_col} with {forecast_model if forecast_model != 'None' else 'No'} Forecast")
                ax.set_xlabel(x_col)
                ax.set_ylabel(y_col)
                ax.legend()
                plt.xticks(rotation=45)
                plt.tight_layout()
                st.pyplot(fig)

            except Exception as e:
                st.error(f"⚠ Error during plotting or forecasting: {e}")

    except Exception as e:
        st.error(f"❌ Failed to read Excel file: {e}")