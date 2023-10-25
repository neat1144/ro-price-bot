# Use an official Node.js runtime as a parent image
FROM node:18.17.1

# Set the timezone to Asia/Taipei
ENV TZ=Asia/Taipei

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the Node.js server will run on
EXPOSE 3030

# Start the Node.js server
CMD ["node", "app.js"]
