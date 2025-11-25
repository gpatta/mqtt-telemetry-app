# Use the official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install app dependencies; use `--production` to install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy app files
COPY . .

# # Expose the backend port
EXPOSE 3001

# Run the backend
CMD ["npm", "start"]
