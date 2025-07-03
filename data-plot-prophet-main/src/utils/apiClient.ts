
import { DataPoint } from './dataProcessing';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export interface ForecastRequest {
  file: File;
  xColumn: string;
  yColumn: string;
  forecastModel: string;
  plotType: string;
  forecastSteps: number;
}

export interface ForecastResponse {
  data: DataPoint[];
  model_info?: any;
  error?: string;
}

export const forecastAPI = {
  async generateForecast(request: ForecastRequest): Promise<ForecastResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('x_column', request.xColumn);
    formData.append('y_column', request.yColumn);
    formData.append('forecast_model', request.forecastModel);
    formData.append('plot_type', request.plotType);
    formData.append('forecast_steps', request.forecastSteps.toString());

    const response = await fetch(`${API_BASE_URL}/forecast`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate forecast');
    }

    return response.json();
  },

  async getAvailableModels() {
    const response = await fetch(`${API_BASE_URL}/models`);
    if (!response.ok) {
      throw new Error('Failed to fetch available models');
    }
    return response.json();
  }
};
