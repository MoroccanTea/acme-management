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

# Install wait-for-it script
RUN apk add --no-cache bash
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]