import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "ingestion-service",
    brokers: ["localhost:9092"]
})