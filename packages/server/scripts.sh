# local database
brew services
brew services start mongodb-community

# docker
docker-compose build && docker-compose up
docker-compose -f docker-compose.test.yml build && docker-compose -f docker-compose.test.yml up