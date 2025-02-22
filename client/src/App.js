import React from "react";
import { Typography, Icon } from 'antd';
import Chatbot from './Chatbot/Chatbot';
const { Title } = Typography;

function App() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Title level={2} >Hansung BOT APP&nbsp;<img src={require("./Chatbot/Images/han_bugi2.png")} /></Title>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>

        <Chatbot />


      </div>
    </div>
  )
}

export default App
