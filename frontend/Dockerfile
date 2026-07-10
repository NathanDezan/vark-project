FROM node:20-slim

WORKDIR /app/frontend

ARG VITE_BACKEND_URL=http://localhost:8000/svc/api
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
