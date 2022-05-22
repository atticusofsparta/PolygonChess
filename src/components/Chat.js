import React, {useState, useEffect} from 'react';
import immer from "immer";





const Chat = ({socket, activeLobby, messages, setMessages, message, setMessage, publicKey}) => {
    
    

    async function addMessage(){
        
        const payload = {
            content: message,
            to: activeLobby,
            sender: publicKey, 
            chatName: activeLobby,
            isChannel: true
        }
        console.log("send this message:", payload)
        socket.emit('send message', payload)
        let sentMessage = immer(messages, draft => {
            draft[activeLobby].push({sender: publicKey, content: message})
        })
        setMessages(sentMessage)
        setMessage('')
        
    }
 

    useEffect(()=>{
        var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
    },[messages])
     

    return(
        <div id="chat">
            <div id='current-lobby'>{activeLobby}</div>
            <div id="messages">
                {messages[activeLobby].map((msg, index)=> <div className='message' key={index}><h3>{msg.sender}</h3><p>{msg.content}</p></div>)}
                
                
                </div>

            <div id="message-form">
            
            <input 
            autoFocus 
            autoComplete='off'
            id="message-input" 
            type="text" 
            placeholder="message" 
            value={message} 
            onChange={(e)=>{setMessage(e.target.value)}} 
            onKeyDown={(e)=>{e.key === "Enter" && addMessage()}}
            
            />
           
            
            </div>
        </div>
    );


}

export default Chat