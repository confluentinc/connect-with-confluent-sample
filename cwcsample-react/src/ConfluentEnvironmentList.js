import React, {useEffect, useState} from 'react';
import './App.css';
import {Button, Container, Table} from 'reactstrap';
import {Link, useParams} from "react-router-dom";



const ConfluentEnvironmentList = () => {
    const { connectionName } = useParams();
    const [environments, setEnvironments] = useState([]);

    useEffect(() => {

        fetch('/api' + window.location.pathname)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                setEnvironments(data);
            })
            .catch(error => {
                console.error("error fetching data: ", error)
            })
    }, []);


    const environmentList = environments.map(environment => {
        return <tr>
            <td>{environment.id}</td>
            <td>{environment.display_name}</td>
            <td>
            <Button outline tag={Link} to={"/connections/confluent/" + connectionName + "/" + environment.id + "/clusters"}> See Clusters</Button>
            </td>
        </tr>
    });

    return (
        <div className="App">
            <Container fluid>
                <header className="App-header">
                    <Table>
                        <tr>
                            <th>
                                Environment ID
                            </th>
                            <th>
                                Environment Name
                            </th>
                        </tr>
                        {environmentList}
                    </Table>
                </header>
            </Container>
        </div>
    );
}

export default ConfluentEnvironmentList;