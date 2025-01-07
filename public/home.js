// Add event listener to the send button
const BASE_URL = "http://localhost:3000/api";
let count = 0;
let lastFetchId=-1


function saveLocalStorage(messages){
  const existingMessages = JSON.parse(localStorage.getItem('chat_messages'));
  const allMessages = [...existingMessages,...messages];
  const recentMessages  = allMessages.slice(-10);

  localStorage.setItem('chat_messages',JSON.stringify(recentMessages));
}


function showLocalMessages(){
  const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
  renderMessages(messages);

}

function renderMessages(messages){
  const chats = document.querySelector('.chat_messages');
  chats.innerHTML="";

  messages.forEach((message,index) => {
    const messageElem = document.createElement('div');
    messageElem.textContent=`${message.username} : ${message.body}`

    chats.appendChild(messageElem);

  });
  chats.scrollTop=chats.scrollHeight;

}

async function showBackendMessages(){

  //Go to LS and retrive lastId
  try{
    const response = await axios.
    get(`${BASE_URL}/user/getMessages`,{params:{lastFetchId}});

    const newMessages = response.data.messages || [];

    if(newMessages.length > 0){
      lastFetchId = newMessages[newMessages.length-1].id;
      saveLocalStorage(newMessages);
      renderMessages([...JSON.parse(localStorage.getItem('chat_messages'))]);
    }
  }
  catch(err){
    console.error("Error Fetching new Messages : ",err);
  }

  //Go to DB and check messages after lastId

  //call saveLS

  //retrive LS

} 
//Combine messages
async function showMessages(){
 await showBackendMessages();
 showLocalMessages();
}


// function showMessages(){

//   count=0;
//   axios
//   .get(`${BASE_URL}/user/getAllMessages?lastFetchId=${lastFetchId}`)
//   .then((response)=> {

//    const chats = document.querySelector('.chat-messages');
//    chats.innerHTML = '';

//    const messages = response.data.messages;
   
//    messages.forEach(element => {
//     const messageWithUser = element.username +" : "+element.body;
//     localStorage.setItem(`${element.id}`,`${messageWithUser}`)
//     lastFetchId=element.id;

//    });


//     formatedMessages = messages.map(message=> {
//       const messageElem =document.createElement('div');
//       messageElem.style.background=count%2==0?'grey':'white';
//       messageElem.textContent = `${message.username} : ${message.body}`;
//       count++;

//       chats.appendChild(messageElem)
//       chats.scrollTop = chats.scrollHeight;
//     })
//   })
//   .catch((err) => {
//     alert("server error")
//   })
// }



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
  axios
    .post(`${BASE_URL}/user/message`, {message:message,token:token})
    .then(() => {

      messageInput.value="";
      showBackendMessages();
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


 setInterval(showMessages,2000);

document.addEventListener('DOMContentLoaded',showBackendMessages());

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('chat_messages')) {
    localStorage.setItem('chat_messages', JSON.stringify([]));
  }
  showMessages();
});
