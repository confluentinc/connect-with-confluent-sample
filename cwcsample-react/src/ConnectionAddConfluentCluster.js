import React, {useState} from 'react';
import './App.css';
import logoname from './cflt-dark.svg'
import leftpanelsettings from './leftpanel-settings.png'
import clustersettings from './clustersettings.png'
import schemasettings from './schemadetails.png'
import {
    Button,
    Card,
    CardImg,
    CardText,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Row
} from "reactstrap";
import {Navigate} from "react-router-dom";

const ConnectionAddConfluentCluster = () => {
    const [confirm, setConfirm] = useState(false);
    const [connectionName, setConnectionName] = useState("");
    const [clusterId,setClusterId] = useState("")
    const [helpPanel, setHelpPanel] = useState(false)

    async function createClusterConnection(type, connectionName, data) {
        const response = await fetch('/api/connections/add/' + type + "/" + connectionName, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: "{\"clusterId\": \"" + data.clusterId.value + "\",\"bootstrapServer\": \"" + data.bootstrapServer.value + "\",\"apiKey\": \"" + data.apiKey.value + "\",\"secret\":\"" + data.secret.value + "\",\"srUrl\":\"" + data.srUrl.value + "\",\"srApiKey\":\"" + data.srApiKey.value + "\",\"srSecret\":\"" + data.srSecret.value + "\"}"
        })
        console.log(response);
        return response;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setConnectionName(event.target.connectionName.value);
        setClusterId(event.target.clusterId.value);

        createClusterConnection("confluentcluster", connectionName, event.target)
            .then(response => {
                if (response.ok){
                    setConfirm(true);
                } else {
                    console.log(response);
                }
            })
    };

    if (confirm) {
        return (
            <Navigate
                to={{
                    pathname: "/connections/confluentcluster/" + connectionName + "/" + clusterId + "/topics",
                }}
            />
        );
    }

    return (
        <div className="App">
            <header className="App-header">
                Add Connection
            </header>
            <Card className={"connection-card"}>
                <CardImg
                    alt="Card image cap"
                    src={logoname}
                    style={{
                        width: "30%",
                        paddingTop: "5%",
                        paddingBottom: "5%",
                        margin: "auto"
                    }}
                    top
                />
                <div>
                    Enter the Confluent Cloud connection information below.

                </div>
                <a href="/#" onClick={() => setHelpPanel(true)} className={"App-link"}>For help, click here.</a>

                <Offcanvas isOpen={helpPanel} toggle={() => setHelpPanel(!helpPanel)} scrollable direction={"end"}>
                    <OffcanvasHeader toggle={() => setHelpPanel(!helpPanel)} style={{fontFamily:"Mark Pro",whiteSpace:"pre-wrap", fontWeight:"bold"}}>
                        Confluent{"\n"}Add Connection Details Help
                    </OffcanvasHeader>
                    <OffcanvasBody style={{fontFamily:"Mark Pro",whiteSpace:"pre-wrap", fontWeight:"bold"}}>
                        Connection Name:{"\n"}
                        <p style={{fontWeight:"normal"}}>Create a name to identify the connection</p>
                        CLUSTER DETAILS{"\n"}{"\n"}
                        <p style={{fontWeight:"normal"}}>Cluster information can be found in 'Cluster Settings' and 'API Keys' menus after choosing a cluster in the Confluent Cloud UI.</p>
                        <p ><img alt="Cluster Settings" src={leftpanelsettings} width="50%"/><img alt="Cluster Settings" src={clustersettings} width="100%"/></p>
                        Cluster ID: {"\n"}
                        <p style={{fontWeight:"normal"}}>The Confluent cluster ID, found in the Cluster Settings for a Kafka Cluster.</p>
                        Bootstrap Server: {"\n"}
                        <p style={{fontWeight:"normal"}}>The Confluent cluster's Bootstrap Server url, found in the Cluster Settings for a Kafka Cluster.</p>
                        API Key & Secret: {"\n"}
                        <p style={{fontWeight:"normal"}}>Use an existing key/secret, or create a new one from "API Keys" in the Cluster menu.</p>
                        SCHEMA REGISTRY DETAILS{"\n"}{"\n"}
                        <p style={{fontWeight:"normal"}}>Schema Registry information can be found in the right hand panel from the Confluent environment that contains your cluster. </p>
                        <p><img alt="Stream Governance Settings" src={schemasettings}  width="80%"/></p>
                        Schema Registry URL: {"\n"}
                        <p style={{fontWeight:"normal"}}>The Schema Registry url, found under Stream Governance as 'Endpoint'.</p>
                        Schema Registry API Key & Secret: {"\n"}
                        <p style={{fontWeight:"normal"}}>Use an existing Schema Registry key/secret, or create a new one from "View & Manage" in the Stream Governance menu under 'Credentials'.</p>

                    </OffcanvasBody>
                </Offcanvas>

                <CardText>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="connectionName"
                                        name="connectionName"
                                        placeholder="Connection Name"
                                        type="text"
                                    />
                                    <Label for="connectionName">
                                        Connection Name
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row style={{paddingBottom:"10px", fontWeight:"bold"}}>
                            Cluster Details
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="clusterId"
                                        name="clusterId"
                                        placeholder="Cluster ID"
                                        type="text"
                                    />
                                    <Label for="clusterId">
                                        Cluster ID
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="bootstrapServer"
                                        name="bootstrapServer"
                                        placeholder="Bootstrap Server"
                                        type="text"
                                    />
                                    <Label for="bootstrapServer">
                                        Bootstrap Server
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="apiKey"
                                        name="apiKey"
                                        placeholder="API Key"
                                        type="password"
                                    />
                                    <Label for="apiKey">
                                        API Key
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="secret"
                                        name="secret"
                                        placeholder="Secret"
                                        type="password"
                                    />
                                    <Label for="secret">
                                        Secret
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row style={{paddingBottom:"10px", fontWeight:"bold"}}>
                            Schema Registry Details
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="srUrl"
                                        name="srUrl"
                                        placeholder="Schema Registry URL"
                                        type="text"
                                    />
                                    <Label for="srUrl">
                                        Schema Registry URL
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="srApiKey"
                                        name="srApiKey"
                                        placeholder="Schema Registry API Key"
                                        type="password"
                                    />
                                    <Label for="srApiKey">
                                        Schema Registry API Key
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="srSecret"
                                        name="srSecret"
                                        placeholder="Schema Registry Secret"
                                        type="password"
                                    />
                                    <Label for="srSecret">
                                        Schema Registry Secret
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Button color="success" outline style={{width: "50%", margin: "auto"}}>
                                Connect
                            </Button>
                        </Row>
                    </Form>

                </CardText>
            </Card>

        </div>
    )
};

export default ConnectionAddConfluentCluster;