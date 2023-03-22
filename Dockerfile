FROM chuting/node:19.6.0-v1
COPY . ./new-blog
WORKDIR /project/new-blog
RUN echo 'nodejs@19.6.0'