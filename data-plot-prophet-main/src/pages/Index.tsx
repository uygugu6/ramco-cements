
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ConfigurationPanel from '@/components/ConfigurationPanel';
import DataVisualization from '@/components/DataVisualization';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import DarkModeToggle from '@/components/DarkModeToggle';
import { generateMockData, exportToCSV, exportChartAsImage, DataPoint } from '@/utils/dataProcessing';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [forecastModel, setForecastModel] = useState<string>('None');
  const [plotType, setPlotType] = useState<string>('Line');
  const [forecastSteps, setForecastSteps] = useState<number>(10);
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showVisualization, setShowVisualization] = useState<boolean>(false);
  
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File, extractedHeaders: string[]) => {
    setFile(selectedFile);
    setHeaders(extractedHeaders);
    setXAxis(extractedHeaders[0] || '');
    setYAxis(extractedHeaders[1] || '');
    setError('');
    setShowVisualization(false);
    
    toast({
      title: "File uploaded successfully",
      description: `Found ${extractedHeaders.length} columns in your Excel file.`,
    });
  };

  const handlePlot = async () => {
    if (!file || !xAxis || !yAxis) {
      setError('Please select a file and configure both axes.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock data (in real app, this would come from your Python backend)
      const plotData = generateMockData(forecastModel, forecastSteps);
      setData(plotData);
      setShowVisualization(true);
      
      toast({
        title: "Plot generated successfully",
        description: forecastModel !== 'None' 
          ? `Generated ${plotType.toLowerCase()} chart with ${forecastModel} forecast.`
          : `Generated ${plotType.toLowerCase()} chart.`,
      });
    } catch (err) {
      setError('Failed to generate plot. Please try again.');
      console.error('Plot generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportImage = () => {
    exportChartAsImage('chart-container', `${yAxis}_${xAxis}_chart.png`);
  };

  const handleExportCSV = () => {
    if (data.length > 0) {
      exportToCSV(data, `${yAxis}_${xAxis}_data.csv`);
      toast({
        title: "Data exported",
        description: "CSV file has been downloaded.",
      });
    }
  };

  const handleRetry = () => {
    setError('');
    handlePlot();
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <DarkModeToggle />
      
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4">Forecasting Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Upload Excel data, configure your analysis, and generate forecasts with ARIMA, SARIMA, or Prophet models
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isLoading={isLoading}
            />
            
            {headers.length > 0 && (
              <ConfigurationPanel
                headers={headers}
                xAxis={xAxis}
                yAxis={yAxis}
                forecastModel={forecastModel}
                plotType={plotType}
                forecastSteps={forecastSteps}
                onXAxisChange={setXAxis}
                onYAxisChange={setYAxis}
                onForecastModelChange={setForecastModel}
                onPlotTypeChange={setPlotType}
                onForecastStepsChange={setForecastSteps}
                onPlot={handlePlot}
                isLoading={isLoading}
                disabled={!file}
              />
            )}
          </div>

          <div className="space-y-6">
            {isLoading && <LoadingSpinner />}
            
            {error && (
              <ErrorMessage message={error} onRetry={handleRetry} />
            )}
            
            {showVisualization && data.length > 0 && !isLoading && (
              <div id="chart-container">
                <DataVisualization
                  data={data}
                  plotType={plotType}
                  xAxisLabel={xAxis}
                  yAxisLabel={yAxis}
                  forecastModel={forecastModel}
                  onExportImage={handleExportImage}
                  onExportCSV={handleExportCSV}
                />
              </div>
            )}
          </div>
        </div>

        {!file && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Get started by uploading an Excel file with your time series data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
