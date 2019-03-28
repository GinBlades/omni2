FROM ruby:2.6 as base
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
RUN npm install -g yarn
RUN mkdir /myapp
WORKDIR /myapp
COPY . /myapp
RUN bundle install
RUN yarn install

FROM base as dev
EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]

FROM base as prod
RUN bundle exec rake assets:precompile
EXPOSE 9292
ENV RACK_ENV=production
ENV RAILS_ENV=production
ENV RAILS_SERVE_STATIC_FILES=true
CMD ["bundle", "exec", "puma"]
