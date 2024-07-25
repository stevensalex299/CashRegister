import express from 'express';
import TransactionRouter from './routes/transactionRouter';

const app = express();
const port = 3001;

app.use(express.json());

const transactionRouter = new TransactionRouter();
app.use('/api', transactionRouter.getRouter());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
