# Stage 1
FROM node:20.12.2 as node_image
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
# Use the BUILD_ENV variable to determine which build configuration to run.
ARG BUILD_ENV
# Use the BASE_HREF variable to set the base href of passport-web
ARG BASE_HREF
# Set a default value for BASE_HREF if it is empty
ENV BASE_HREF=${BASE_HREF:-/}
# Run npm build command for the given environment with optional --base-href argument
RUN npm run build:$BUILD_ENV -- --base-href=$BASE_HREF

# Stage 2
FROM nginx:alpine
COPY ./docker/nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY --from=node_image /app/dist/ai4hf-passport-web /usr/share/nginx/html