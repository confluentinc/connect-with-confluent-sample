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
            <Button outline
                    tag={Link}
                    to={"/connections/confluent/" + connectionName + "/" + envId + "/" + cluster.id + "/topics"}
                    state={{bootstrapUrl: cluster.spec.http_endpoint}}
            > See Topics</Button>
            {/*<td>{cluster.spec.http_endpoint}</td>*/}
        </tr>
    });

    return (
        <div className="App">
            <Container fluid>
                <header className="App-header">
                    <Table>
                        <tr>
                            <th>
                                Cluster ID
                            </th>
                            <th>
                                Cluster Name
                            </th>
                        </tr>
                        {clusterList}
                    </Table>
                </header>
            </Container>
        </div>
    );
}

export default ConfluentClusterList;