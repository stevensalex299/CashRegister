import React, { useState } from 'react';
import './App.css';
import {
  handleSingleTransactionSubmit,
  handleFileUpload,
  handleDecimalInput,
  handleCurrencyChange,
} from './helpers/transactionHandlers';

const App: React.FC = () => {
  const [amountOwed, setAmountOwed] = useState<number | ''>('');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [singleTransactionCurrency, setSingleTransactionCurrency] =
    useState<string>('');
  const [transactionResponse, setTransactionResponse] = useState<{
    message: string;
    status: 'success' | 'error';
  } | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileUploadCurrency, setFileUploadCurrency] = useState<string>('');
  const [fileUploadResponse, setFileUploadResponse] = useState<{
    message: string;
    status: 'success' | 'error';
  } | null>(null);

  return (
    <div className="container">
      <h1>Cash Register Client</h1>
      <div>
        <h2>Single Transaction</h2>
        <form>
          <input
            type="number"
            min={0.0}
            step="0.01"
            value={amountOwed}
            onChange={(e) => handleDecimalInput(e, setAmountOwed)}
            placeholder="Amount Owed"
          />
          <input
            type="number"
            min={0.0}
            step="0.01"
            value={amountPaid}
            onChange={(e) => handleDecimalInput(e, setAmountPaid)}
            placeholder="Amount Paid"
          />
          <input
            type="text"
            value={singleTransactionCurrency}
            onChange={(e) =>
              handleCurrencyChange(e, setSingleTransactionCurrency)
            }
            placeholder="Currency"
          />
          <button
            type="button"
            onClick={() =>
              handleSingleTransactionSubmit(
                amountOwed,
                amountPaid,
                singleTransactionCurrency,
                (message, status) => setTransactionResponse({ message, status })
              )
            }
          >
            Submit Transaction
          </button>
        </form>
        {transactionResponse && (
          <p className={`response ${transactionResponse.status}`}>
            {transactionResponse.message}
          </p>
        )}
      </div>
      <div>
        <h2>File Upload</h2>
        <form>
          <input
            type="file"
            accept=".txt"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
          <input
            type="text"
            value={fileUploadCurrency}
            onChange={(e) => handleCurrencyChange(e, setFileUploadCurrency)}
            placeholder="Currency"
          />
          <button
            type="button"
            onClick={() =>
              handleFileUpload(file, fileUploadCurrency, (message, status) =>
                setFileUploadResponse({ message, status })
              )
            }
          >
            Upload File
          </button>
        </form>
        {fileUploadResponse && (
          <p className={`response ${fileUploadResponse.status}`}>
            {fileUploadResponse.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
