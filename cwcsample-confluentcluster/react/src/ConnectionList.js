import React, {useState, useEffect} from 'react';
import './App.css';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

const ConnectionList = () => {
    const [connections, setConnections] = useState([]);

    useEffect(() => {

        fetch('api/connections')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                setConnections(data);
            })
            .catch(error => {
                console.error("error fetching data: ", error)
            })
    }, []);

    const connectionList = Object.keys(connections).map(connection => {
        let url = "/connections"
        if (connections[connection].type === "confluentcluster") {
            url = "/connections/confluentcluster/" + connection + "/" + connection.details.clusterId + "/topics"
        }

        return <tr key={connection}>
            <td style={{whiteSpace: 'nowrap'}}>{connection} </td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={url}>View</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    return (
        <div className="App">
            <Container fluid>
                <header className="App-header">
                    Connections
                    <div className="App">
                        <Table className="mt-4">
                            <thead>
                            <tr>
                                <th width="20%">Name</th>
                                <th width="20%"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {connectionList}
                            </tbody>
                        </Table>
                        <Button color="success" tag={Link} to="/connections/add">Add Connection</Button>
                    </div>
                </header>
            </Container>
        </div>
    );
}

export default ConnectionList;