
async function createNotification({ type, message, targetUser }) {
  // insert into DB OR push via WebSocket
  console.log("NOTIFICATION:", { type, message, targetUser });

  // if you use a notifications table:
  // await NotificationModel.create({ type, message, user: targetUser });
}

module.exports = createNotification;
