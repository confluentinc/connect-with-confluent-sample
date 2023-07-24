import React from "react";
import {NavItem, NavLink, Nav} from "reactstrap";
import classNames from "classnames";

const SideBar = ({ isOpen }) => (

    <div className={classNames("sidebar", { "is-open": isOpen})}>

        <Nav vertical style={{fontSize:"20px"}}>
            <NavItem style={{paddingTop:"15px", paddingBottom:"15px",paddingLeft:"15px"}}>
                <NavLink  href="/">Home</NavLink>
            </NavItem>
            <NavItem style={{paddingTop:"15px", paddingBottom:"15px",paddingLeft:"15px"}}>
                <NavLink href="/connections">Connections</NavLink>
            </NavItem>
        </Nav>
    </div>

);

export default SideBar;