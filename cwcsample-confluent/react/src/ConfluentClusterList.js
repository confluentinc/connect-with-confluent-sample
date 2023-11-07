import React, {useEffect, useState} from 'react';
import './App.css';
import {Button, Container, Table} from 'reactstrap';
import {Link, useParams} from "react-router-dom";

const ConfluentClusterList = () => {
    const { connectionName, envId } = useParams();
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch('/api' + window.location.pathname)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                setClusters(data);
            })
            .catch(error => {
                console.error("error fetching data: ", error)
            })
            .finally(
                setLoading(false)
            )
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    const clusterList = clusters.map(cluster => {
        return <tr>
            <td>{cluster.id}</td>
            <td>{cluster.spec.display_name}</td>
            <td><Button outline
                    tag={Link}
                    to={"/connections/confluent/" + connectionName + "/" + envId + "/" + cluster.id + "/topics"}
                    state={{bootstrapUrl: cluster.spec.http_endpoint}}
            > Add Connection</Button></td>
        </tr>
    });

    return (
        <div className="App" style={{paddingTop: '100px'}}>
            <Container fluid>
                <header className="App-header">
                    <Table>
                        <thead >
                        <tr className="list-header">
                            <th>
                                Cluster ID
                            </th>
                            <th>
                                Cluster Name
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody className="list-body">
                        {clusterList}
                        </tbody>
                    </Table>
                </header>
            </Container>
        </div>
    );
}

export default ConfluentClusterList;