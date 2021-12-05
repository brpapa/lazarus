# This file defines how the docker image is built
# Each command is a new layer in the image
# RUN - executed during the building of the image
# CMD - executed when running the image in a container


# --- STAGE 0
FROM node:17 as base
# FROM node:lts-alpine as base


# --- STAGE 1
FROM base AS builder

# create and set the working directory where the next commands will be executed
RUN mkdir -p /app
WORKDIR /app

# the dependencies will be reinstalled only if package.json change, thanks to caching by image layer
COPY ["package.json", "package-lock.json*", "./"]

# install code dependencies
RUN npm install

# copy source code into image, except files in .dockerignore
COPY . .

RUN npm run build


# --- STAGE 2: grabbing a fresh copy of the base image to reduce the final size
FROM base as runner
ENV DEBUG 'app:*'

# copy in the built dependencies
COPY --from=builder /app /app

WORKDIR /app

CMD ["npm", "run", "start"]
