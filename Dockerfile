# Use an official Node runtime as the parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the current directory contents into the container
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Copy the start script and make it executable
RUN chmod +x start.sh

# Use a non-root user for better security
USER node

# Command to run the application
CMD ["./start.sh"]