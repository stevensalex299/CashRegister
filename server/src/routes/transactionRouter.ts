import { Router, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import multer from 'multer';
import TransactionManager from '../managers/transactionManager.ts';
import {
  readFileContent,
  writeFileContent,
  deleteFile,
  getFilePath,
} from '../utils/fileUtils.ts';

class TransactionRouter {
  private router: Router;

  private upload: multer.Multer;

  private transactionManager: TransactionManager;

  constructor() {
    this.router = Router();
    this.upload = multer({ dest: 'uploads/' });
    this.transactionManager = new TransactionManager();
    this.initializeRoutes();
  }

  /**
   * Initialize the routes for the transaction endpoints.
   */
  private initializeRoutes() {
    this.router.post('/transaction', this.handleSingleTransaction.bind(this));
    this.router.post(
      '/transactions-file',
      this.upload.single('file'),
      this.handleFileTransactions.bind(this)
    );
  }

  /**
   * Handles a single transaction request.
   * This endpoint calculates the change due based on the amount owed, amount paid, and currency, then returns the formatted change.
   *
   * @param req - The express request object.
   * @param req.body - The body of the request, expected to be a JSON object with the following properties:
   *   - `amountOwed` (number): The amount that the customer owes in dollars.
   *   - `amountPaid` (number): The amount that the customer has paid in dollars.
   *   - `currency` (string): The currency code Ex: 'USD'.
   * @param res - The express response object.
   * @returns A JSON response containing the formatted change as a string, or an error message if the request is invalid.
   *   - On success: `{ change: string }`
   *   - On failure: HTTP status code 400 (Bad Request) or 500 (Internal Server Error) with an error message.
   */
  private async handleSingleTransaction(req: Request, res: Response) {
    const { amountOwed, amountPaid, currency } = req.body;

    // Check that expected input is present
    if (!amountOwed || !amountPaid || !currency) {
      return res.status(400).send('Missing required parameters');
    }

    // Check that input is in number format
    if (Number.isNaN(amountOwed) || Number.isNaN(amountPaid)) {
      return res
        .status(400)
        .send('Invalid amount owed or amount paid. Must be a number.');
    }

    // Check that number input is greater than zero
    if (amountOwed <= 0 || amountPaid <= 0) {
      return res
        .status(400)
        .send('Amount owed and amount paid must be positive numbers.');
    }

    try {
      const change = await this.transactionManager.processTransaction(
        Number(amountOwed),
        Number(amountPaid),
        currency
      );
      res.json({ change });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  /**
   * Handles a file upload containing multiple transactions and calculates the change for each transaction.
   * This endpoint reads a file containing transactions, processes each transaction to calculate change, and returns a file with the results.
   *
   * @param req - The express request object.
   * @param req.body - The body of the request, expected to be a JSON object with the following property:
   *   - `currency` (string): The currency code Ex: 'USD'.
   * @param req.file - The uploaded file, which should be a text file containing transactions. Each line of the file should be in the format:
   *   - `amountOwed,amountPaid`
   * @param res - The express response object.
   * @returns A file download response containing the calculated change for each transaction.
   *   - On success: A downloadable file (`change.txt`) containing the formatted change for each transaction.
   *   - On failure: HTTP status code 400 (Bad Request) or 500 (Internal Server Error) with an error message.
   */
  private async handleFileTransactions(req: Request, res: Response) {
    const { currency } = req.body;
    const { file } = req;

    // Check that expected input is present
    if (!file || !currency) {
      return res.status(400).send('Missing required parameters');
    }

    try {
      const filePath = getFilePath(file.filename);
      const fileContent = readFileContent(filePath);
      const transactions = fileContent
        .split('\n')
        .filter((line) => line.trim() !== '');

      const results = await Promise.all(
        transactions.map(async (line) => {
          const [amountOwed, amountPaid] = line.split(',').map(Number);

          // Check that input is in number format
          if (Number.isNaN(amountOwed) || Number.isNaN(amountPaid)) {
            throw new Error(
              'Invalid amount owed or amount paid in file. Must be numbers.'
            );
          }

          // Check that number input is greater than zero
          if (amountOwed <= 0 || amountPaid <= 0) {
            throw new Error(
              'Amount owed and amount paid must be positive numbers.'
            );
          }

          return this.transactionManager.processTransaction(
            amountOwed,
            amountPaid,
            currency
          );
        })
      );

      // Create the output file
      const outputFilePath = getFilePath('output.txt');
      writeFileContent(outputFilePath, results.join('\n'));

      // Send the output file as a response
      res.download(outputFilePath, 'change.txt', (err) => {
        if (err) {
          res.status(500).send('Error downloading file');
        }

        // Cleanup
        deleteFile(filePath);
        deleteFile(outputFilePath);
      });
    } catch (error) {
      // Could be optimized to support wrong input for file instead of returning 500
      res.status(500).send(error.message);
    }
  }

  /**
   * Get the router instance.
   * @returns The express router instance.
   */
  public getRouter() {
    return this.router;
  }
}

export default TransactionRouter;
