import './App.css';
import React from 'react'
import {Button, Card, CardText, Col, Container, Row} from "reactstrap";
import {Link} from "react-router-dom";

const Home = () => {

    return (
        <div className="App" >
            <header className="App-header">
                Welcome!
            </header>

            <Container style={{paddingTop:"75px"}}>
                <Row>
                    <Col sm="6" >
                        <Card className={"connection-card"}>

                            <CardText >
                                See all your data connections.
                            </CardText>
                            <div>
                                <Button color="secondary" outline tag={Link} to={"/connections"}>
                                    View Connections
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col sm="6" >
                        <Card className={"connection-card"}>

                            <CardText >
                                Set Your Data in Motion!
                            </CardText>
                            <div>
                                <Button color="secondary" outline tag={Link} to={"https://www.confluent.io/partners/connect"}>
                                    Learn more
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6" >
                        <Card className={"connection-card"}>

                            <CardText >
                                Check out the Connect with Confluent documentation
                            </CardText>
                            <div>
                                <Button color="secondary" outline tag={Link} to={"https://docs.confluent.io/cloud/current/client-apps/connect-w-confluent.html"}>
                                    View Docs
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col sm="6" >
                        <Card className={"connection-card"}>

                            <CardText >
                                Some other thing so stuff is balanced.
                            </CardText>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
  );
}

export default Home;
