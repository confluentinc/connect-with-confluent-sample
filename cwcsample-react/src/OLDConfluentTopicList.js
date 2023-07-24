import React, {useEffect, useState} from 'react';
import './App.css';
import {Col, Container, Row, Table} from 'reactstrap';
import {useLocation, useNavigate, useParams} from "react-router-dom";


const ConfluentTopicList = () => {
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    const location = useLocation();
    const bootstrapUrl = location.state?.bootstrapUrl;

    const { connectionName, envId, clusterId } = useParams();

    async function getTopics() {
        const response = await fetch('/api/' + window.location.pathname)
        console.log(response);
        return response;
    }

    useEffect(() => {

        getTopics()
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                setTopics(data);
            })
            .catch(error => {
                console.error("error fetching data: ", error)
            })
    }, []);

    const topicList = topics.map(topic => {
        return <Row>
            <Col>{topic.id}</Col>
            <Col>{topic.spec.display_name}</Col>
        </Row>
    });

    //if no bootstrap is passed, return to clusters page for the requested cluster
    if (bootstrapUrl == null){
        navigate("/connections/confluent/" + connectionName + "/" + envId + "/clusters");
        return;
    }

    return (
        <div className="App">
            <Container fluid>
                <header className="App-header">
                    <Table>
                        {topicList}
                    </Table>
                </header>
            </Container>
        </div>
    );
}

export default ConfluentTopicList;