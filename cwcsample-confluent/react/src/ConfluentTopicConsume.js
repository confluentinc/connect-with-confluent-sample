import React, {useState} from 'react';
import './App.css';
import {Col, Row} from 'reactstrap';
import SockJsClient from 'react-stomp';
import {useParams} from "react-router-dom";

const ConfluentTopicConsume = () => {
    const [messages, setMessages] = useState([]);
    const [consuming, setConsuming] = useState(false);
    const {topicName} = useParams();


    const SOCKET_URL = 'http://localhost:8080/ws-consumer/';

    let onConnected = () => {
        if (!consuming){
            startConsuming()
                .then(
                    setConsuming(true)
                )
        }
        console.log("Connected!!")
    }

    let onMessageReceived = (msg) => {
        console.log('New Message Received!!', msg);
        setMessages(messages.concat(msg));
    }

    async function startConsuming() {
        await fetch('/api/' + window.location.pathname)
    }

    const messagesList = messages.map(message => {
        const value = JSON.stringify(message.value);

        return <Row key={message.partition + "-" + message.offset}>
            <Col className="align-middle">{message.offset} ({message.partition})</Col>
            <Col className="align-middle">{message.timestamp}</Col>
            <Col className="align-middle">{message.key}</Col>
            <Col className="align-middle">{value}</Col>
        </Row>
    });

    return (
        <div className="App">
            <SockJsClient
                url={SOCKET_URL}
                topics={['/consume']}
                onConnect={onConnected}
                onDisconnect={console.log("Disconnected")}
                onMessage={msg => onMessageReceived(msg)}
                debug={false}
            />
            <header className="App-header">
                {topicName}
            </header>
            <p>See messages in real time:</p>
            <Row style={{fontSize:"18px", fontWeight:"bold"}}>
                <Col>
                    Offset (Partition)
                </Col>
                <Col >
                    Timestamp
                </Col>
                <Col >
                    Key
                </Col>
                <Col >
                    Value
                </Col>
            </Row>
            {messagesList}
        </div>
    )
}

export default ConfluentTopicConsume;