import React, { useState } from 'react';
import '../App.css';
import logoname from '../cflt-dark.svg'
import {Button, Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";


const AppNavbar = ({toggleSidebar}) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Navbar color="info" expand="md" className="navbar" fixed="top" >
            <Button color="info" onClick={toggleSidebar} >
                <FontAwesomeIcon icon={faAlignLeft} />
            </Button>
            <Container>
                <NavbarBrand  to="/">
                    <img
                        alt=""
                        src={logoname}
                        height = "30"
                    />{' '}
                </NavbarBrand>
            Connect with Confluent Sample
            </Container>

            <NavbarToggler onClick={() => {
                setIsOpen(!isOpen)
            }}/>
            <Collapse isOpen={isOpen} navbar>
                <Nav style={{ width: "100%", justifyContent: "end"}} navbar>
                    <NavItem>
                        <NavLink href="https://www.confluent.io/partners/connect">About</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="https://docs.confluent.io/cloud/current/client-apps/connect-w-confluent.html">Docs</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default AppNavbar;