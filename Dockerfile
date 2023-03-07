# build stage
FROM node:16-bullseye as build-stage

ARG VITE_API_URL=https://staging.leerstandsmeldung.de
ARG VITE_TITLE=23

ARG VITE_I18N_LOCALE=de
ARG VITE_I18N_FALLBACK_LOCALE=en
# GEOCODING
ARG VITE_GEOAPIFY_KEY=xxx
ARG VITE_MAPTILER_KEY=xxx
ARG VITE_MAPTILER_MAP_LIGHT=yyyy
ARG VITE_MAPTILER_MAP_DARK=zzzz


ENV VITE_API_URL=${VITE_API_URL:-http://localhost:3000}
ENV VITE_TITLE=${VITE_TITLE:-23}
ENV VITE_I18N_LOCALE=${VITE_I18N_LOCALE:-de}
ENV VITE_I18N_FALLBACK_LOCALE=${VITE_I18N_FALLBACK_LOCALE:-en}
ENV VITE_GEOAPIFY_KEY=${VITE_GEOAPIFY_KEY:-xxx}
ENV VITE_MAPTILER_KEY=${VITE_MAPTILER_KEY:-xxx}
ENV VITE_MAPTILER_MAP_LIGHT=${VITE_MAPTILER_MAP_LIGHT:-yyy}
ENV VITE_MAPTILER_MAP_DARK=${VITE_MAPTILER_MAP_DARK:-zzz}


# RUN apt-get update && apt-get upgrade -y
WORKDIR /app
RUN echo ${VITE_API_URL}
RUN echo ${VITE_TITLE}
RUN node --version
COPY package*.json ./
RUN yarn install
COPY . .
# ENV NODE_ENV=production
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf_orig 
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]