
import html2canvas from 'html2canvas';

export interface DataPoint {
  x: string | number;
  y: number;
  forecast?: number;
  type: 'actual' | 'forecast';
}

export const generateMockData = (forecastModel: string, forecastSteps: number): DataPoint[] => {
  // Generate mock historical data
  const historicalData: DataPoint[] = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    historicalData.push({
      x: date.toISOString().split('T')[0],
      y: Math.floor(Math.random() * 1000) + 500 + Math.sin(i / 5) * 200,
      type: 'actual'
    });
  }

  // Add forecast data if model is selected
  if (forecastModel !== 'None') {
    const lastValue = historicalData[historicalData.length - 1].y;
    const lastDate = new Date(historicalData[historicalData.length - 1].x as string);
    
    for (let i = 1; i <= forecastSteps; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(forecastDate.getDate() + i);
      
      // Simple trend simulation based on model
      let forecastValue = lastValue;
      switch (forecastModel) {
        case 'ARIMA':
          forecastValue = lastValue + Math.random() * 100 - 50;
          break;
        case 'SARIMA':
          forecastValue = lastValue + Math.sin(i / 7) * 150 + Math.random() * 50 - 25;
          break;
        case 'Prophet':
          forecastValue = lastValue * (1 + (Math.random() * 0.1 - 0.05));
          break;
      }
      
      historicalData.push({
        x: forecastDate.toISOString().split('T')[0],
        y: 0, // No actual value for forecast points
        forecast: Math.max(0, forecastValue),
        type: 'forecast'
      });
    }
  }

  return historicalData;
};

export const exportToCSV = (data: DataPoint[], filename: string) => {
  const csvContent = [
    ['Date', 'Actual', 'Forecast'].join(','),
    ...data.map(point => [
      point.x,
      point.type === 'actual' ? point.y : '',
      point.forecast || ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportChartAsImage = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Chart element not found');
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting chart as image:', error);
    alert('Failed to export chart as image. Please try again.');
  }
};
