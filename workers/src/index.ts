import { startConsumer } from "./consumer";

async function start() {
  try {
    await startConsumer();
  } catch (error) {
    console.error("Worker failed to start", error);
    process.exit(1);
  }
}

start();
