import { Kafka } from "kafkajs";
import { evaluateRules } from "./rules/rule.engine";

const kafka = new Kafka({
  clientId: "event-worker",
  brokers: ["localhost:9092"]
});

export const consumer = kafka.consumer({
  groupId: "event-workers-group"
});

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "events.ingested",
    fromBeginning: false
  });

  console.log("Worker connected to Kafka");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());

      const channels = evaluateRules(event)

      console.log("Channels", channels)

      // TEMP processing
      console.log("Processing event:", event);
    }
  });
}
