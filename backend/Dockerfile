FROM node:20-alpine 
WORKDIR /app

# install dependencies (production)
COPY package*.json ./
RUN npm install
# copy source and generate prisma client
COPY . .
RUN npx prisma generate || true

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]

