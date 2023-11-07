import React from 'react';
import './App.css';
import logoname from './cflt-dark.svg'

import {Button, Card, CardImg, CardText, Col, Container, Row} from 'reactstrap';
import { Link } from 'react-router-dom';

const ConnectionAdd = () => {

    return (

        <div className="App">
            <header className="App-header">
                Add a New Connection
            </header>
            <Container fluid>
                <Row>
                    <Col sm="6">
                        <Card className={"connection-card"}>
                            <CardImg
                                alt="Card image cap"
                                src={logoname}
                                style={{
                                    width: "75%",
                                    paddingTop: "5%",
                                    paddingBottom: "5%",
                                    margin: "auto"
                                }}
                                top
                            />
                            <CardText >
                                Connect to Confluent Cloud to explore available clusters, then choose a cluster & topic to produce or consume.
                            </CardText>
                            <div>
                                <Button color="secondary" outline tag={Link} to={"/connections/add/confluent"}>
                                    Add Connection
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card className={"connection-card"}>
                            <CardText >
                                Some other connection / native integration
                            </CardText>
                            <div>
                                <Button color="secondary" outline tag={Link} to={"/connections/add/confluent"}>
                                    Add Connection
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ConnectionAdd;
