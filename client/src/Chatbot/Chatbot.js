import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';
import Message from './Sections/Message';
import InfoComponent from './Sections/info'
import { List, Icon, Avatar } from 'antd';
import LaptopComponent from './Sections/laptop';
import WelcomeComponent from './Sections/welcome';
import ICTdesignDepartmentComponent from './Sections/ICTdesignDepartment';
import WifiComponent from './Sections/WifiSetting';

function Chatbot() {
    const dispatch = useDispatch();
    //useSelector를 통해 state->message->messages에 전체 메시지가 있으므로 가져옴 
    const messagesFromRedux = useSelector(state => state.message.messages)

    //사용자가 처음 들어올 때마다 Welcome 이벤트 실행(환영하는 인삿말)
    useEffect(() => {

        eventQuery('Welcome')

    }, [])

    //text는 keyPressHanlder에서 사용자가 입력한 메시지
    const textQuery = async (text) => {

        //사용자가 보낸 text메시지 처리   
        //dialogflow에서 postman으로 request보낼 때의 형식과 같음  
        let conversation = {
            who: '사용자',
            content: {
                text: {
                    text: text
                }
            }
        }

        dispatch(saveMessage(conversation))

        // 챗봇에서 보낸 답변 메시지 처리

        const textQueryVariables = {
            text
        }
        try {
            // /textQuery 로 request보내기 
            // Axios = Node.js를 위한 Promise API를 활용하는 HTTP 비동기 통신 라이브러리
            //endpoint는 /api/dialogflow/textQuery
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)

            //정보들 중에서 fulfillmentMessages안에 있는 부분만 받게 처리
            //text를 dialogflow에게 보내고 response에 있는 data를 저장
            for (let content of response.data.fulfillmentMessages) {

                conversation = {
                    who: '한성봇',
                    content: content
                }

                //채팅 정보를 redux 저장하기 위해 conversation에 담긴 정보를 ../_actions/message_actions로 보냄
                dispatch(saveMessage(conversation))
            }


        }
        //에러 처리
        catch (error) {
            conversation = {
                who: '한성봇',
                content: {
                    text: {
                        text: " Error just occured, please check the problem"
                    }
                }
            }

            dispatch(saveMessage(conversation))


        }

    }

    //event는 keyPressHanlder에서 사용자가 입력한 메시지
    const eventQuery = async (event) => {
        //eventQuery는 사용자가 입력하지 않아도 응답을 받음
        const eventQueryVariables = {
            event
        }
        try {
            // /eventQuery 로 request보내기 
            //endpoint는 /api/dialogflow/eventQuery
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables)
            //text를 dialogflow에게 보내고 response에 있는 data를 저장
            for (let content of response.data.fulfillmentMessages) {

                let conversation = {
                    who: '한성봇',
                    content: content
                }

                dispatch(saveMessage(conversation))
            }


        }
        //에러 처리
        catch (error) {
            let conversation = {
                who: '한성봇',
                content: {
                    text: {
                        text: " Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
        }

    }


    const keyPressHanlder = (e) => {
        if (e.key === "Enter") {

            if (!e.target.value) {
                return alert('챗봇에게 물어볼 내용을 입력해주세요')
            }

            //textQuery쪽으로 사용자가 입력한 text보내기
            textQuery(e.target.value)


            e.target.value = "";
        }
    }

    //메시지 렌더링
    const renderOneMessage = (message, i) => {

        console.log('message', message)

        // 메시지 종류를 구분하기 위한 if문의 나열

        // text형 대화에 대한 Message 컴포넌트(Sections/Message.js에 있는 템플릿 가져오기)
        if (message.content && message.content.text && message.content.text.text) {
            return <Message key={i} who={message.who} text={message.content.text.text} />
        }
        else if (message.content && message.content.payload.fields) { // richContent 그대로 왔음
            const AvatarSrc = message.who === '한성봇' ? <img src={require("./Images/han_bugi2.png")} /> : <Icon type={null} />

            var ResultComponent;

            if (message.content.payload.fields.richContent.listValue.values[0].listValue.values[0].structValue.fields["intent"]) {
                const detectedIntent = message.content.payload.fields.richContent.listValue.values[0].listValue.values[0].structValue.fields["intent"].stringValue
                console.log(detectedIntent)

                switch (detectedIntent) {
                    case 'welcome':
                        ResultComponent = WelcomeComponent(message);
                        break;
                    case 'laptop':
                        ResultComponent = LaptopComponent(message);
                        break;
                    case 'wifi_setting':
                        return WifiComponent(message);
                    case 'department_ICTdesign':
                        return ICTdesignDepartmentComponent(message);
                }
            }
            else {
                ResultComponent = "Error occured, check Redux"
                console.log("un-known or un-structed Intent")
            }

            return (
                <List.Item style={{ padding: '1rem' }}>
                    <List.Item.Meta
                        avatar={<Avatar icon={AvatarSrc} />}
                        title={message.who}
                        description={ResultComponent}
                    />
                </List.Item>
            )
        }

    }

    //메시지 1개씩 다루어야하기 때문에 map을 사용하고 renderOneMessage에 줌
    const renderMessage = (returnedMessages) => {

        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return renderOneMessage(message, i);
            })
        } else {
            return null;
        }
    }

    //템플릿 생성(화면에 redux에 저장된 메시지들을 출력해 보여주기)
    return (
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>

                {renderMessage(messagesFromRedux)}


            </div>
            <input
                style={{
                    margin: 0, width: '100%', height: 50,
                    borderRadius: '4px', padding: '5px', fontSize: '1rem'
                }}
                placeholder="Send a message..."
                onKeyPress={keyPressHanlder}
                type="text"
            />

        </div>
    )
}

export default Chatbot;
