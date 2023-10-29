// Array para almacenar mensajes
const chatMessages = [];

// Función para enviar un mensaje
export function sendMessage(senderId, receiverId, message) {
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedTime = `${hour}:${minutes}`;
    const messageObj = {
        senderId,
        receiverId,
        message,
        timestamp:formattedTime,
    };
    chatMessages.push(messageObj);
    console.log(chatMessages)
}

// Función para obtener los mensajes entre dos usuarios
export function getMessagesBetweenUsers(userId1, userId2) {
    const messages = chatMessages.filter(
        (message) =>
            (message.senderId === userId1 && message.receiverId === userId2) ||
            (message.senderId === userId2 && message.receiverId === userId1)
    );
    console.log(messages)
    return messages.sort((a, b) => a.timestamp - b.timestamp);
}
