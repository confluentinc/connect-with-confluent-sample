import React, {useState} from 'react';
import './App.css';
import logoname from './cflt-dark.svg'
import {Button, Card, CardImg, CardText, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import { Navigate } from "react-router-dom";

const ConnectionAddConfluent = () => {
    const [confirm, setConfirm] = useState(false);
    const [connectionName, setConnectionName] = useState("");

    async function createConnection(type, connectionName, data) {
        const response = await fetch('/api/connections/add/' + type + "/" + connectionName, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: "{\"apiKey\": \"" + data.apiKey.value + "\",\"secret\":\"" + data.secret.value + "\"}"
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
        <div>
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