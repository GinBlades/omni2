#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /myapp/tmp/pids/server.pid

# Exec the container's main process (CMD in Dockerfile)
exec "$@"
