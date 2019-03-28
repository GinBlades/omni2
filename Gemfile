source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.6'
gem 'pg'
gem 'sass-rails'
gem 'uglifier'
gem 'jbuilder'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  gem 'web-console'
  gem 'listen'
  gem 'pry-rails'
end

gem "slim-rails"
gem "devise"
gem "redcarpet"

gem 'simple_form', '~> 3.4'
gem "ransack"
gem "will_paginate"

gem "mina"
gem "mina-whenever"
gem "whenever", require: false
gem "redis-rails"

gem "sprockets"
gem "sprockets-es6"
gem "puma"
