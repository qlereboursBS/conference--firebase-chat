const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getDatabase } = require('firebase-admin/database');

admin.initializeApp();

exports.deleteMessage = functions.database
  .ref('/rooms/room-1/messages/{messageId}')
  .onCreate(async (createdMessageSnap, context) => {
    console.log(
      'A new message was sent: ',
      createdMessageSnap.val(),
      context.params.messageId
    );

    const messageId = context.params.messageId;
    const newMessage = createdMessageSnap.val();
    const messageContent = newMessage.content.toLowerCase();
    console.log('Message content:', messageContent);

    const insults = ['cunt', 'asshole'];
    if (!insults.some((insult) => messageContent.includes(insult))) {
      console.log('No insult found');
      return;
    }

    const messageRef = getDatabase().ref(
      `/rooms/room-1/messages/${messageId}/isDeletedByAdmin`
    );
    return messageRef.set(true, (error) => {
      if (error) {
        console.error('An error occurred while deleting');
      }
      console.log('Message deleted successfully');
    });
  });

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
