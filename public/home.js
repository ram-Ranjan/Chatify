// Add event listener to the send button

const BASE_URL = "http://localhost:3000/api";
let count = 0;


document.addEventListener('DOMContentLoaded',showMessages());


function showMessages(){
  count=0;
  axios
  .get(`${BASE_URL}/user/getAllMessages`)
  .then((response)=> {

   const chats = document.querySelector('.chat-messages');
   const messages = response.data.messages;
    formatedMessages = messages.map(message=> {
      const messageElem =document.createElement('div');
      messageElem.style.background=count%2==0?'grey':'white';
      messageElem.textContent = `${message.username} : ${message.body}`;
      count++;

      chats.appendChild(messageElem)
      chats.scrollTop = chats.scrollHeight;
    })
  })
  .catch((err) => {
    alert("server error")
  })
}



document.querySelector(".send-btn").addEventListener("click", sendMessage);

function sendMessage() {
  // Get the message from the input field

  const messageInput = document.querySelector(".chat-input input");

  const user = localStorage.getItem("username");
  const token = localStorage.getItem("authToken")
  const message = messageInput.value.trim();

  if (!message) {
    alert("Message cannot be empty!");
    return;
  }

  const messageWithUser = user + " : " + message; 

  axios
    .post(`${BASE_URL}/user/message`, {message:message,token:token})
    .then(() => {

        const messageElement = document.createElement("div");

        messageElement.style.background = count % 2 === 0 ? "grey" : "white";
        count++;

        messageElement.textContent = messageWithUser;
        messageElement.classList.add("message");

        // Append the message to the chat messages container
        document.querySelector(".chat-messages").appendChild(messageElement);

        // Clear the input field
        messageInput.value = "";

        // Scroll to the bottom of the chat messages container
        const chatContainer = document.querySelector(".chat-messages");
        chatContainer.scrollTop = chatContainer.scrollHeight;      
      
        console.log("Message Saved");
    })
    .catch((err) => {
      if (err.response && err.response.status === 409) {
        //409 conflict status code(violates the unique constraint)
        alert("Enter the message properly before sending.");
      } else {
        console.error("Error saving message:", err);
      }
    });
}
