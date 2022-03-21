FROM node:14.8.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy over package.json file(s)
COPY package*.json ./

# Install app dependencies
RUN npm run refresh

# Copy over app files
COPY . .

# Expose PORT
EXPOSE 8080

# Start application
CMD [ "npm", "start" ]