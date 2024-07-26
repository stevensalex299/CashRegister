/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import cors from 'cors';
import TransactionRouter from './routes/transactionRouter';

const app = express();
const port = 3001;

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow only the local React client to access this server
  })
);

app.use(express.json());

const transactionRouter = new TransactionRouter();
app.use('/api', transactionRouter.getRouter());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
