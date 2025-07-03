
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DataPoint {
  x: string | number;
  y: number;
  forecast?: number;
  type: 'actual' | 'forecast';
}

interface DataVisualizationProps {
  data: DataPoint[];
  plotType: string;
  xAxisLabel: string;
  yAxisLabel: string;
  forecastModel: string;
  onExportImage: () => void;
  onExportCSV: () => void;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  plotType,
  xAxisLabel,
  yAxisLabel,
  forecastModel,
  onExportImage,
  onExportCSV,
}) => {
  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (plotType) {
      case 'Bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="y" fill="#8884d8" name={yAxisLabel} />
              {forecastModel !== 'None' && (
                <Bar dataKey="forecast" fill="#82ca9d" name="Forecast" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'Scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Scatter dataKey="y" fill="#8884d8" name={yAxisLabel} />
              {forecastModel !== 'None' && (
                <Scatter dataKey="forecast" fill="#82ca9d" name="Forecast" />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        );

      default: // Line
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name={yAxisLabel}
              />
              {forecastModel !== 'None' && (
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  name="Forecast"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {plotType} Chart - {yAxisLabel} vs {xAxisLabel}
            {forecastModel !== 'None' && ` (${forecastModel} Forecast)`}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onExportImage}>
              <Download className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button variant="outline" size="sm" onClick={onExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
