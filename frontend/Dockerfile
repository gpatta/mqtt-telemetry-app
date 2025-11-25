# frontend/Dockerfile

FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that the application listens on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]