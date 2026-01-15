import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { addDays, subMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // 1. Create Tenant
    const tenant = await prisma.tenant.create({
        data: {
            name: "Acme Corp",
            apiKey: "test-tenant-key-" + uuidv4(),
        }
    });
    console.log(`Created tenant: ${tenant.id}`);

    // 2. Event Types
    const eventTypes = ["user_signup", "password_reset", "order_created", "payment_failed"];

    // 3. Create Events with Deliveries
    for (let i = 0; i < 20; i++) {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const statusRandom = Math.random();

        // Create Event
        const event = await prisma.event.create({
            data: {
                tenantId: tenant.id,
                eventType: eventType,
                payload: {
                    user_id: 1000 + i,
                    email: `user${i}@example.com`,
                    meta: { source: "web", version: "1.0" }
                },
                receivedAt: subMinutes(new Date(), i * 10), // staggered times
            }
        });

        // Create Deliveries based on random status
        if (statusRandom > 0.8) {
            // Pending (no deliveries)
        } else if (statusRandom > 0.5) {
            // Success
            await prisma.deliveryLog.create({
                data: {
                    eventId: event.id,
                    tenantId: tenant.id,
                    channel: "EMAIL",
                    status: "SUCCESS",
                    attempts: 1,
                }
            });
        } else if (statusRandom > 0.2) {
            // Failed
            await prisma.deliveryLog.create({
                data: {
                    eventId: event.id,
                    tenantId: tenant.id,
                    channel: "SMS",
                    status: "FAILED",
                    attempts: 3,
                    error: "Provider error: Rate limit exceeded"
                }
            });
        } else {
            // Processing (retrying)
            await prisma.deliveryLog.create({
                data: {
                    eventId: event.id,
                    tenantId: tenant.id,
                    channel: "WEBHOOK",
                    status: "RETRYING",
                    attempts: 1,
                    lastTriedAt: new Date()
                }
            });
        }
    }

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
