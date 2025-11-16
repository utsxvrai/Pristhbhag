const rabbit = require('../../src/utils/rabbitmq');
const createNotification = require('./notify');  // db insert or websocket

(async () => {
  const channel = await rabbit.getChannel();

  await channel.consume('notification_queue', async (msg) => {
    const payload = JSON.parse(msg.content.toString());

    try {
      await createNotification({
        type: 'BLOG_CREATED',
        message: `Blog "${payload.title}" created by ${payload.authorId}`,
        targetUser: 'manager'
      });

      channel.ack(msg);
    } catch (err) {
      channel.nack(msg, false, false);
    }
  });
})();
