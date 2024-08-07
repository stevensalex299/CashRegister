# Cash Register

## The Problem

Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases, the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the client's goals. The program should:

1. Accept a flat file as input
   1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
   2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
   1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
   2. Each new line in the input file should be a new line in the output file

## Sample Input

2.12,3.00

1.97,2.00

3.33,5.00

## Sample Output

3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

_Remember the last one is random_

## The Fine Print

Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider

Here are a couple of thoughts about the domain that could influence your response:

- What might happen if the client needs to change the random divisor?
- What might happen if the client needs to add another special case (like the random twist)?
- What might happen if sales closes a new client in France?

## Dependencies

To successfully run the application, ensure you have the following dependencies installed:

1. **Node.js**: The runtime environment for running JavaScript server-side.

   - [Download and install Node.js](https://nodejs.org/)

2. **Docker**: Required to build and run Docker containers.

   - [Download and install Docker](https://www.docker.com/products/docker-desktop)

3. **Docker Compose**: Used to define and run multi-container Docker applications.

   - [Install Docker Compose](https://docs.docker.com/compose/install/)

4. **Knex**: SQL query builder used in the backend.

   - [Install Knex globally](https://knexjs.org/#Installation)
   - Install locally within the project:
     ```bash
     npm install knex
     ```

5. **PostgreSQL**: Database management system used for storing data. (If testing without Docker)
   - [Download and install PostgreSQL](https://www.postgresql.org/download/)

## Running the Application with Docker

To build and run the application using Docker, follow these steps:

1. **Build and Start Docker Containers**

   Run the following command from the root of the project:

   ```bash
   npm run docker:up
   ```

   This command will:

   - Build Docker images for both the client and server.
   - Start Docker containers for both the client and server.
   - Ensure that the application is accessible at http://localhost:3000 for the client and http://localhost:3001 for the server.

2. **Access the Application**

   Open your browser and go to http://localhost:3000 to access the client application. The server will be running at http://localhost:3001 and will handle API requests from the client.

## Running the Application Locally (Without Docker)

If you prefer to run the application locally without Docker, follow these steps:

1. **Install Dependencies**

   Ensure you have all the necessary local dependencies installed by running:

   ```bash
   npm install
   ```

2. **Database Setup**

   Make sure you have a PostgreSQL database running and configured. Update the .env file with your database credentials or configure them directly in your application.

3. **Run the Server**

   Navigate to the server directory and start the server:

   ```bash
   npm run start:server
   ```

4. **Run the Client**

   Navigate to the client directory, and start the client:

   ```bash
   npm run start:client
   ```

5. **Access the Application**

   Open your browser and go to http://localhost:3000 to access the client application.
   The server will be running at http://localhost:3001 and will handle API requests from the client.

## Linting and Testing

To ensure code quality and consistency, run the linter using:

```bash
   npm run lint
```

To run the tests for the application, use:

```bash
   npm run test
```

By following these steps, you should be able to run and test the application both locally and within Docker containers. If you have any questions, feel free to reach out!
