# Stage 1 — build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
# build for production
RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:stable-alpine
# remove default nginx html
RUN rm -rf /usr/share/nginx/html/*
# copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html
# copy optional nginx conf for frontend inner nginx (serves index.html for SPA)
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

# expose internal port 80 (not mapped to host)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
