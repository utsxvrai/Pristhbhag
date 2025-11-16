const rabbit = require('../../src/utils/rabbitmq');
const sendEmail = require('./send-email');   // your SMTP logic

(async () => {
  const channel = await rabbit.getChannel();

  await channel.consume('email_queue', async (msg) => {
    const payload = JSON.parse(msg.content.toString());

    try {
      await sendEmail({
        to: 'utsavrai2115@gmail.com',
        subject: `New blog created`,
        text: `Title: ${payload.title}, Author: ${payload.authorId}`
      });

      channel.ack(msg);
    } catch (err) {
      channel.nack(msg, false, false); // dead-letter on fail
    }
  });
})();
