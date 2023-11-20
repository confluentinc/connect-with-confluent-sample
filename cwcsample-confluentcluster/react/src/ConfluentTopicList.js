import React, {useEffect, useState} from 'react';
import './App.css';
import {Button, Container, Table} from 'reactstrap';
import {Link, useParams} from "react-router-dom";


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
        return <tr key={topic.topic_name} className="align-middle">
            <td>{topic.topic_name}</td>
            <td>
                <Button outline className="topic-button"
                    tag={Link}
                    to={"/connections/confluentcluster/" + connectionName + "/" + clusterId + "/topic/" + topic.topic_name + "/produce"}
                >Produce</Button>
                <Button outline className="topic-button"
                        tag={Link}
                        to={"/connections/confluentcluster/" + connectionName + "/" + clusterId + "/topic/" + topic.topic_name + "/consume"}
                >Consume</Button>
            </td>
        </tr>
    });

    return (
        <div className="App">
            <header className="App-header">
                Topics
            </header>
            <p className="App">
                Choose a topic below to produce or consume.
            </p>
            <Container fluid style={{width:"75%"}}>
                <Table hover responsive={true} className="App">
                    <thead>
                        <tr>
                            <th style={{width:"70%"}}>Topic Name</th>
                            <th style={{width:"30%"}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {topicList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default ConfluentTopicList;