#!/bin/sh

echo "default_user = $RABBITMQ_DEFAULT_USER
      default_pass = $RABBITMQ_DEFAULT_PASSWORD
      listeners.tcp.default = $RABBITMQ_PORT
      disk_free_limit.absolute = 1GB
      default_vhost = /" > /etc/rabbitmq/rabbitmq.conf

# Create Rabbitmq user
( rabbitmqctl wait --timeout 60 $RABBITMQ_PID_FILE ; \
rabbitmqctl add_user $RABBITMQ_USER $RABBITMQ_PASSWORD 2>/dev/null ; \
rabbitmqctl set_user_tags $RABBITMQ_USER management ; \
rabbitmqctl set_permissions -p / $RABBITMQ_USER  ".*" ".*" ".*" ; \
echo "*** User '$RABBITMQ_DEFAULT_USER' completed. ***" ; \
echo "*** User '$RABBITMQ_USER' completed. ***" ; \
echo "*** Log in the WebUI at port 15672 (example: http:/localhost:15672) ***") &

# $@ is used to pass arguments to the rabbitmq-server command.
# For example if you use it like this: docker run -d rabbitmq arg1 arg2,
# it will be as you run in the container rabbitmq-server arg1 arg2
rabbitmq-server $@