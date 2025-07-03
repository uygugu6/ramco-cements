
# Python FastAPI Backend Structure

This document outlines the complete Python backend structure that you'll need to deploy separately.

## Project Structure
```
backend/
├── main.py
├── requirements.txt
├── models/
│   ├── __init__.py
│   ├── forecasting.py
│   └── data_models.py
├── utils/
│   ├── __init__.py
│   ├── data_processing.py
│   └── validators.py
└── routers/
    ├── __init__.py
    └── forecast.py
```

## Files to Create:

### requirements.txt
```
fastapi==0.104.1
uvicorn==0.24.0
pandas==2.1.4
numpy==1.24.3
statsmodels==0.14.0
prophet==1.1.4
openpyxl==3.1.2
python-multipart==0.0.6
python-jose==3.3.0
passlib==1.7.4
bcryptjs==4.1.1
```

### main.py
```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import forecast
import uvicorn

app = FastAPI(title="Forecasting API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Forecasting API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### models/data_models.py
```python
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class ForecastModel(str, Enum):
    NONE = "None"
    ARIMA = "ARIMA"
    SARIMA = "SARIMA"
    PROPHET = "Prophet"

class PlotType(str, Enum):
    LINE = "Line"
    BAR = "Bar"
    SCATTER = "Scatter"

class ForecastRequest(BaseModel):
    x_column: str
    y_column: str
    forecast_model: ForecastModel
    plot_type: PlotType
    forecast_steps: int = 10

class DataPoint(BaseModel):
    x: str
    y: float
    forecast: Optional[float] = None
    type: str

class ForecastResponse(BaseModel):
    data: List[DataPoint]
    model_info: Optional[dict] = None
    error: Optional[str] = None
```

### models/forecasting.py
```python
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet
import warnings
warnings.filterwarnings('ignore')

class ForecastingModels:
    
    @staticmethod
    def prepare_data(df: pd.DataFrame, x_col: str, y_col: str):
        """Prepare and clean data for forecasting"""
        # Create a copy and sort by date
        data = df[[x_col, y_col]].copy()
        data = data.dropna()
        
        # Convert x_col to datetime if possible
        try:
            data[x_col] = pd.to_datetime(data[x_col])
            data = data.sort_values(x_col)
        except:
            pass
            
        # Fill missing values
        data[y_col] = data[y_col].fillna(method='ffill').fillna(method='bfill')
        
        return data
    
    @staticmethod
    def arima_forecast(data: pd.DataFrame, y_col: str, steps: int):
        """ARIMA forecasting"""
        try:
            model = ARIMA(data[y_col], order=(2, 1, 2))
            fitted_model = model.fit()
            forecast = fitted_model.forecast(steps=steps)
            
            return forecast.tolist(), {
                "model": "ARIMA(2,1,2)",
                "aic": fitted_model.aic,
                "bic": fitted_model.bic
            }
        except Exception as e:
            raise Exception(f"ARIMA forecasting failed: {str(e)}")
    
    @staticmethod
    def sarima_forecast(data: pd.DataFrame, y_col: str, steps: int):
        """SARIMA forecasting"""
        try:
            model = SARIMAX(data[y_col], 
                          order=(1, 1, 1), 
                          seasonal_order=(1, 1, 1, 12))
            fitted_model = model.fit(disp=False)
            forecast = fitted_model.forecast(steps=steps)
            
            return forecast.tolist(), {
                "model": "SARIMA(1,1,1)(1,1,1,12)",
                "aic": fitted_model.aic,
                "bic": fitted_model.bic
            }
        except Exception as e:
            raise Exception(f"SARIMA forecasting failed: {str(e)}")
    
    @staticmethod
    def prophet_forecast(data: pd.DataFrame, x_col: str, y_col: str, steps: int):
        """Prophet forecasting"""
        try:
            # Prepare data for Prophet
            prophet_data = data[[x_col, y_col]].copy()
            prophet_data.columns = ['ds', 'y']
            
            # Ensure datetime format
            prophet_data['ds'] = pd.to_datetime(prophet_data['ds'])
            
            # Create and fit model
            model = Prophet(
                daily_seasonality=False,
                weekly_seasonality=True,
                yearly_seasonality=True
            )
            model.fit(prophet_data)
            
            # Create future dataframe
            future = model.make_future_dataframe(periods=steps)
            forecast = model.predict(future)
            
            # Extract forecast values
            forecast_values = forecast['yhat'].tail(steps).tolist()
            
            return forecast_values, {
                "model": "Prophet",
                "components": ["trend", "weekly", "yearly"]
            }
        except Exception as e:
            raise Exception(f"Prophet forecasting failed: {str(e)}")
```

### utils/data_processing.py
```python
import pandas as pd
import io
from typing import Tuple, List

def process_excel_file(file_content: bytes) -> Tuple[pd.DataFrame, List[str]]:
    """Process uploaded Excel file and return DataFrame and column names"""
    try:
        # Read Excel file
        df = pd.read_excel(io.BytesIO(file_content))
        
        # Get column names
        columns = df.columns.tolist()
        
        # Basic cleaning
        df = df.dropna(how='all')  # Remove completely empty rows
        
        return df, columns
    except Exception as e:
        raise Exception(f"Failed to process Excel file: {str(e)}")

def validate_forecasting_data(df: pd.DataFrame, x_col: str, y_col: str) -> bool:
    """Validate that data is suitable for forecasting"""
    if len(df) < 10:
        raise Exception("Insufficient data for forecasting. Need at least 10 data points.")
    
    if x_col not in df.columns:
        raise Exception(f"Column '{x_col}' not found in data.")
    
    if y_col not in df.columns:
        raise Exception(f"Column '{y_col}' not found in data.")
    
    # Check for numeric data in y column
    try:
        pd.to_numeric(df[y_col], errors='coerce')
    except:
        raise Exception(f"Column '{y_col}' does not contain numeric data.")
    
    return True
```

### routers/forecast.py
```python
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from models.data_models import ForecastRequest, ForecastResponse, DataPoint, ForecastModel
from models.forecasting import ForecastingModels
from utils.data_processing import process_excel_file, validate_forecasting_data
import pandas as pd
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/forecast", response_model=ForecastResponse)
async def create_forecast(
    file: UploadFile = File(...),
    x_column: str = Form(...),
    y_column: str = Form(...),
    forecast_model: str = Form(...),
    plot_type: str = Form(...),
    forecast_steps: int = Form(10)
):
    try:
        # Read and process the uploaded file
        content = await file.read()
        df, columns = process_excel_file(content)
        
        # Validate the data
        validate_forecasting_data(df, x_column, y_column)
        
        # Prepare data
        clean_data = ForecastingModels.prepare_data(df, x_column, y_column)
        
        # Create response data points for historical data
        data_points = []
        for _, row in clean_data.iterrows():
            data_points.append(DataPoint(
                x=str(row[x_column]),
                y=float(row[y_column]),
                type="actual"
            ))
        
        model_info = None
        
        # Generate forecast if model is selected
        if forecast_model != "None":
            try:
                if forecast_model == "ARIMA":
                    forecast_values, model_info = ForecastingModels.arima_forecast(
                        clean_data, y_column, forecast_steps
                    )
                elif forecast_model == "SARIMA":
                    forecast_values, model_info = ForecastingModels.sarima_forecast(
                        clean_data, y_column, forecast_steps
                    )
                elif forecast_model == "Prophet":
                    forecast_values, model_info = ForecastingModels.prophet_forecast(
                        clean_data, x_column, y_column, forecast_steps
                    )
                else:
                    raise Exception(f"Unknown forecasting model: {forecast_model}")
                
                # Add forecast points
                last_date = clean_data[x_column].iloc[-1]
                if isinstance(last_date, str):
                    # If date is string, try to parse it
                    try:
                        last_date = pd.to_datetime(last_date)
                    except:
                        # If parsing fails, use index-based approach
                        for i, forecast_value in enumerate(forecast_values):
                            data_points.append(DataPoint(
                                x=str(len(clean_data) + i + 1),
                                y=0,
                                forecast=float(forecast_value),
                                type="forecast"
                            ))
                        return ForecastResponse(data=data_points, model_info=model_info)
                
                # Add forecast points with proper dates
                for i, forecast_value in enumerate(forecast_values):
                    forecast_date = last_date + timedelta(days=i+1)
                    data_points.append(DataPoint(
                        x=forecast_date.strftime("%Y-%m-%d"),
                        y=0,
                        forecast=float(forecast_value),
                        type="forecast"
                    ))
                    
            except Exception as e:
                return ForecastResponse(
                    data=data_points,
                    error=f"Forecasting failed: {str(e)}"
                )
        
        return ForecastResponse(data=data_points, model_info=model_info)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/models")
async def get_available_models():
    return {
        "models": ["None", "ARIMA", "SARIMA", "Prophet"],
        "plot_types": ["Line", "Bar", "Scatter"]
    }
```

## Deployment Instructions:

1. Create a new directory for your backend
2. Copy all the above files into the appropriate structure
3. Install dependencies: `pip install -r requirements.txt`
4. Run the server: `python main.py`
5. The API will be available at http://localhost:8000
6. API documentation at http://localhost:8000/docs

## Frontend Integration:

Update your frontend to call this backend by modifying the `handlePlot` function in your React app to make actual API calls to this FastAPI backend.
