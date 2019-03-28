require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
# require "action_cable/engine"
require "sprockets/railtie"
# require "rails/test_unit/railtie"
require "sprockets/es6"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Omni2
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1
    config.time_zone = "Central Time (US & Canada)"

    config.session_store :redis_store, {
      servers: [
        {
          host: Rails.application.secrets.redis_host,
          port: 6379,
          db: 0,
          namespace: "session"
        }
      ],
      expire_after: 90.minutes,
      key: "_#{Rails.application.class.parent_name.downcase}_session"
    }

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Don't generate system test files.
    config.generators do |g|
      g.system_tests    false
      g.stylesheets     false
      g.javascripts     false
      g.helper          false
    end
  end
end
