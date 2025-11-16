const ampqlib = require('amqplib');
require('dotenv').config();

let connection;
let channel;


async function connectRabbitMQ() {
    const url = process.env.RABBITMQ_URL || 'amqp://localhost';
    const maxAttempts = 6;
    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            connection = await ampqlib.connect(url);
            channel = await connection.createChannel();
            console.log('Connected to RabbitMQ');
            break;
        } catch (error) {
            attempt += 1;
            const waitMs = 1000 * Math.pow(2, attempt); // exponential backoff
            console.error(`Failed to connect to RabbitMQ (attempt ${attempt}/${maxAttempts}), retrying in ${waitMs}ms`, error.message || error);
            if (attempt >= maxAttempts) throw error;
            await new Promise((res) => setTimeout(res, waitMs));
        }
    }

    // Ensure exchange and queues exist. Use underscore names to match worker consumers.
    await channel.assertExchange('blog-events', 'topic', { durable: true });

    await channel.assertQueue('email_queue', { durable: true });
    await channel.assertQueue('notification_queue', { durable: true });

    await channel.bindQueue('email_queue', 'blog-events', 'blog.created');
    await channel.bindQueue('notification_queue', 'blog-events', 'blog.created');

    return channel;
}

async function getChannel() {
    if (!channel) {
        await connectRabbitMQ();
    }
    return channel;
}

async function publishEvent(exchange, routingKey, payload) {
  if (!channel) await connectRabbitMQ();
  channel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
}

module.exports = {
    getChannel,
    publishEvent,
};




    