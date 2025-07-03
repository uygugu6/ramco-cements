
import React, { useCallback } from 'react';
import { Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { processExcelFile } from '@/utils/excelProcessor';

interface FileUploadProps {
  onFileSelect: (file: File, headers: string[]) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please select an Excel file (.xlsx or .xls)');
      return;
    }

    try {
      const excelData = await processExcelFile(file);
      onFileSelect(file, excelData.headers);
    } catch (error) {
      console.error('Error reading file:', error);
      alert(`Error reading file: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  }, [onFileSelect]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Upload Excel File
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Select an .xlsx or .xls file to get started
          </p>
          <Button asChild disabled={isLoading}>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {isLoading ? 'Processing...' : 'Choose File'}
            </label>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
