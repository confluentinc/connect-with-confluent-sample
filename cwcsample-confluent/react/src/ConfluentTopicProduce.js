import React, {useEffect, useState} from 'react';
import './App.css';
import {Button, Col, Container, Row, Table} from 'reactstrap';
import {Link, useParams} from "react-router-dom";

////TODO
const ConfluentTopicList = () => {
    const [topics, setTopics] = useState([]);
    const { connectionName, clusterId } = useParams();


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
            <Col className="align-middle">{topic.topic_name}</Col>
            <Col>
                <Button outline
                    tag={Link}
                    to={"/connections/confluentcluster/" + connectionName + "/" + clusterId + "/topic/" + topic.topic_name}
                > Select</Button>
            </Col>
        </Row>
    });

    return (
        <div >
            <Container fluid>
                    <Table responsive={true} className="App-header">
                        <tr>
                            <th>
                                Topic Name
                            </th>
                        </tr>
                        <div className="App">
                            {topicList}
                        </div>
                    </Table>
            </Container>
        </div>
    );
}

export default ConfluentTopicList;