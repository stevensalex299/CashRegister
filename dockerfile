# Use the official Node.js image as the base image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the uploads directory
RUN mkdir -p /uploads

# Set permissions for the uploads directory
RUN chown -R node:node /uploads

# Build the server
RUN npm run build:server

# Build the client
# RUN npm run build:client

# Expose ports for both server (3001) and client (3000)
EXPOSE 3000  
EXPOSE 3001

# Start both server and client
CMD ["npm", "run", "start"]