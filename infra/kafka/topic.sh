#!/bin/bash

kafka-topics --bootstrap-server localhost:9092 --create \
  --topic events.ingested \
  --partitions 3 \
  --replication-factor 1

kafka-topics --bootstrap-server localhost:9092 --create \
  --topic events.email.dispatch \
  --partitions 3 \
  --replication-factor 1

kafka-topics --bootstrap-server localhost:9092 --create \
  --topic events.sms.dispatch \
  --partitions 3 \
  --replication-factor 1

kafka-topics --bootstrap-server localhost:9092 --create \
  --topic events.webhook.dispatch \
  --partitions 3 \
  --replication-factor 1

kafka-topics --bootstrap-server localhost:9092 --create \
  --topic events.dlq \
  --partitions 1 \
  --replication-factor 1
