import apiClient from './api';
import { Dispatch, SetStateAction } from 'react';

type ResponseStatus = 'success' | 'error';

export const handleSingleTransactionSubmit = async (
  amountOwed: number | '',
  amountPaid: number | '',
  singleTransactionCurrency: string,
  setResponse: (message: string, status: ResponseStatus) => void
) => {
  if (
    amountOwed === '' ||
    amountPaid === '' ||
    singleTransactionCurrency === ''
  ) {
    setResponse('Please provide amounts paid, owed, and a currency.', 'error');
    return;
  }

  try {
    const result = await apiClient.post('/transaction', {
      amountOwed,
      amountPaid,
      currency: singleTransactionCurrency,
    });
    setResponse(
      `Transaction successful, your change is ${result.data.change}`,
      'success'
    );
  } catch (error) {
    setResponse('Error processing transaction', 'error');
  }
};

export const handleFileUpload = async (
  file: File | null,
  fileUploadCurrency: string,
  setResponse: (message: string, status: ResponseStatus) => void
) => {
  if (!file || fileUploadCurrency === '') {
    setResponse('Please select a file and provide a currency.', 'error');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('currency', fileUploadCurrency);

    const response = await apiClient.post('/transactions-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'change.txt');
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    setResponse('Transaction file processed successfully.', 'success');
  } catch (error) {
    setResponse('Error processing file upload', 'error');
  }
};

export const handleDecimalInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setter: Dispatch<SetStateAction<number | ''>>
) => {
  const value = e.target.value;
  const numValue = parseFloat(value);
  const decimalPart = value.split('.')[1] || '';

  if (!isNaN(numValue) && numValue > 0 && decimalPart.length <= 2) {
    setter(numValue);
  } else {
    setter('');
  }
};

export const handleCurrencyChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setter: React.Dispatch<React.SetStateAction<string>>
) => {
  const value = e.target.value;
  if (!/\d/.test(value)) {
    // Prevent numeric values
    setter(value);
  } else {
    setter('');
  }
};
