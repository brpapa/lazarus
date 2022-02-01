# Declarates how the docker image is built
# Each command is a new layer in the image
# RUN - executed during the building of the image
# CMD - executed when running the image in a container
# COPY - copy files from context (host OS) into container, excluding files in .dockerignore
# ! To build an image with this dockerfile must be passed the /packages path as context

# --- STAGE 0
FROM node:16 as base
RUN npm install -g npm@latest


# --- STAGE 1
FROM base AS builder

RUN mkdir -p /app
WORKDIR /app

RUN mkdir -p /api
RUN mkdir -p /shared
COPY ["api/package.json", "api/package-lock.json*", "./api/"]
COPY ["shared/package.json", "shared/package-lock.json*", "./shared/"]

WORKDIR /app/shared
RUN npm install
COPY ./shared .

WORKDIR /app/api
RUN npm install
COPY ./api .

RUN npm run db:generate-client


# --- STAGE 2: grabbing a fresh copy of the base image to reduce the final size
FROM base as runner

# copy in the built dependencies
COPY --from=builder /app /app

WORKDIR /app/api

CMD ["npm", "run", "start"]
