const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getDatabase } = require('firebase-admin/database');
const dayjs = require('dayjs');

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

exports.deleteMessageScheduling = functions.pubsub
  .schedule('every 1 minutes')
  .onRun((context) => {
    console.log('Running query to delete old messages');
    const messageRef = getDatabase().ref(`/rooms/room-1/messages/`);
    const deleteBefore = dayjs().subtract(1, 'day').valueOf();
    console.log('Will delete messages before', deleteBefore);
    return messageRef
      .orderByChild('createdAt')
      .endAt(deleteBefore)
      .once(
        'child_added',
        (messageSnap) => {
          messageSnap.ref.remove((error) => {
            if (error) {
              console.error('error while deleting', error);
            }
          });
        },
        (error) => {
          console.error('Error while getting messages to delete');
          console.error(error);
        }
      );
  });
