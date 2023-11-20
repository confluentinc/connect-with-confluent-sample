import React, {useState} from 'react';
import './App.css';
import logoname from './cflt-dark.svg'
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
    Offcanvas, OffcanvasBody,
    OffcanvasHeader,
    Row
} from "reactstrap";
import { Navigate } from "react-router-dom";
import rightpaneladmin from "./rightpanel-admin.png";
import resourceid from "./resourceid.png"

const ConnectionAddConfluent = () => {
    const [confirm, setConfirm] = useState(false);
    const [connectionName, setConnectionName] = useState("");
    const [helpPanel, setHelpPanel] = useState(false)


    async function createConnection(type, connectionName, data) {
        const response = await fetch('/api/connections/add/' + type + "/" + connectionName, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: "{\"apiKey\": \"" + data.apiKey.value + "\",\"secret\":\"" + data.secret.value + "\",\"apiId\":\""+ data.apiId.value +"\"}"
        })
        console.log(response);
        return response;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setConnectionName(event.target.connectionName.value);

        createConnection("confluent", connectionName, event.target)
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
                    pathname: "/connections/confluent/" + connectionName + "/environments",
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

                <a href="#" onClick={() => setHelpPanel(true)} className={"App-link"}>For help, click here.</a>

                <Offcanvas isOpen={helpPanel} toggle={() => setHelpPanel(!helpPanel)} scrollable direction={"end"}>
                    <OffcanvasHeader toggle={() => setHelpPanel(!helpPanel)} style={{fontFamily:"Mark Pro",whiteSpace:"pre-wrap", fontWeight:"bold"}}>
                        Confluent{"\n"}Add Connection Details Help
                    </OffcanvasHeader>
                    <OffcanvasBody style={{fontFamily:"Mark Pro",whiteSpace:"pre-wrap", fontWeight:"bold"}}>
                        Connection Name:{"\n"}
                        <p style={{fontWeight:"normal"}}>Create a name to identify the connection</p>
                        API Key & Secret: {"\n"}
                        <p style={{fontWeight:"normal"}}>Use an existing key/secret, or create a new one from "Cloud API Keys" in the admin menu in the top right of Confluent Cloud.</p>
                        <p ><img alt="Cloud API Keys" src={rightpaneladmin} width="50%"/></p>
                        Cloud API Key Resource ID: {"\n"}
                        <p style={{fontWeight:"normal"}}>The Resource ID for the Cloud API Key, found after selecting a Cloud API Key/Secret to use or creating a new one.</p>
                        <p><img alt="Resource ID" src={resourceid}  width="50%"/></p>
                    </OffcanvasBody>
                </Offcanvas>

                <CardText >
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
                        <Row>
                            <Col>
                                <FormGroup floating>
                                    <Input
                                        id="apiId"
                                        name="apiId"
                                        placeholder="Cloud API Key Resource ID"
                                        type="text"
                                    />
                                    <Label for="apiId">
                                        Cloud API Key Resource ID
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col></Col>
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

export default ConnectionAddConfluent;