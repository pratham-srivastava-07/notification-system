import { kafka } from "./client";

export const producer = kafka.producer();

export async function initProducer() {
  await producer.connect();
  console.log("Kafka producer connected");
}
