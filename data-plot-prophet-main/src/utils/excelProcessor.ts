import * as XLSX from 'xlsx';

export interface ExcelData {
  headers: string[];
  data: any[];
}

export const processExcelFile = async (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty'));
          return;
        }
        
        // First row contains headers
        const headers = (jsonData[0] as string[]).filter(header => header !== undefined && header !== '');
        
        // Rest of the rows contain data
        const dataRows = jsonData.slice(1).filter(row => (row as any[]).some(cell => cell !== undefined && cell !== ''));
        
        resolve({
          headers,
          data: dataRows
        });
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const validateDataForForecasting = (data: any[], xColumn: string, yColumn: string): boolean => {
  if (data.length < 10) {
    throw new Error('Insufficient data for forecasting. Please provide at least 10 data points.');
  }
  
  // Check if columns exist and have valid data
  const hasValidData = data.some(row => {
    const xValue = row[xColumn];
    const yValue = row[yColumn];
    return xValue !== undefined && yValue !== undefined && !isNaN(Number(yValue));
  });
  
  if (!hasValidData) {
    throw new Error('Selected columns do not contain valid data for analysis.');
  }
  
  return true;
};
