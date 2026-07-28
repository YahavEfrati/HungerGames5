# Use a lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the React development server with hot-reloading
CMD ["npm", "start"]
