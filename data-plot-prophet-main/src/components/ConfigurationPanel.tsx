
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ConfigurationPanelProps {
  headers: string[];
  xAxis: string;
  yAxis: string;
  forecastModel: string;
  plotType: string;
  forecastSteps: number;
  onXAxisChange: (value: string) => void;
  onYAxisChange: (value: string) => void;
  onForecastModelChange: (value: string) => void;
  onPlotTypeChange: (value: string) => void;
  onForecastStepsChange: (value: number) => void;
  onPlot: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  headers,
  xAxis,
  yAxis,
  forecastModel,
  plotType,
  forecastSteps,
  onXAxisChange,
  onYAxisChange,
  onForecastModelChange,
  onPlotTypeChange,
  onForecastStepsChange,
  onPlot,
  isLoading,
  disabled,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="x-axis">X-Axis (Date)</Label>
            <Select value={xAxis} onValueChange={onXAxisChange} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder="Select X-axis column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="y-axis">Y-Axis (Values)</Label>
            <Select value={yAxis} onValueChange={onYAxisChange} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder="Select Y-axis column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forecast-model">Forecasting Model</Label>
            <Select value={forecastModel} onValueChange={onForecastModelChange} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder="Select forecasting model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="ARIMA">ARIMA</SelectItem>
                <SelectItem value="SARIMA">SARIMA</SelectItem>
                <SelectItem value="Prophet">Prophet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plot-type">Plot Type</Label>
            <Select value={plotType} onValueChange={onPlotTypeChange} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder="Select plot type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Line">Line</SelectItem>
                <SelectItem value="Bar">Bar</SelectItem>
                <SelectItem value="Scatter">Scatter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {forecastModel !== 'None' && (
          <div className="space-y-2">
            <Label htmlFor="forecast-steps">Forecast Steps</Label>
            <Input
              type="number"
              value={forecastSteps}
              onChange={(e) => onForecastStepsChange(parseInt(e.target.value) || 10)}
              min={1}
              max={365}
              disabled={disabled}
              placeholder="Number of steps to forecast"
            />
          </div>
        )}

        <Button 
          onClick={onPlot} 
          disabled={disabled || !xAxis || !yAxis || isLoading}
          className="w-full"
        >
          {isLoading ? 'Generating Plot...' : 'Generate Plot'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConfigurationPanel;
