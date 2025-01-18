# Use Node.js as the base image
FROM node:23.6-bookworm

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
