import './App.css';
import React from 'react'
import {useState} from "react";
import AppNavbar from "./components/AppNavbar";
import AppSidebar from "./components/AppSidebar";
import Home from "./Home";
import ConnectionList from "./ConnectionList";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConnectionAdd from "./ConnectionAdd";
import ConnectionAddConfluent from "./ConnectionAddConfluent";
import ConfluentEnvironmentList from "./ConfluentEnvironmentList";
import ConfluentClusterList from "./ConfluentClusterList";
import ConfluentTopicList from "./ConfluentTopicList";
import ConnectionAddConfluentCluster from "./ConnectionAddConfluentCluster";
import ConfluentTopicProduce from "./ConfluentTopicProduce";
import ConfluentTopicConsume from "./ConfluentTopicConsume";

function App() {

    const [sidebarIsOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

    return (
        <Router>
            <AppNavbar toggleSidebar={toggleSidebar}/>
            <AppSidebar isOpen={sidebarIsOpen} toggle={toggleSidebar} />
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route path='/connections' exact={true} element={<ConnectionList/>}/>
                <Route path='/connections/add' exact={true} element={<ConnectionAdd/>}/>
                <Route path='/connections/add/confluentcluster' exact={true} element={<ConnectionAddConfluentCluster/>}/>
                <Route path='/connections/confluentcluster/:connectionName/:clusterId/topics' element={<ConfluentTopicList/>}/>
                <Route path='/connections/confluentcluster/:connectionName/:clusterId/topic/:topicName/produce' element={<ConfluentTopicProduce/>}/>
                <Route path='/connections/confluentcluster/:connectionName/:clusterId/topic/:topicName/consume' element={<ConfluentTopicConsume/>}/>


                {/*Keep for addition of OAuth & unified env / cluster auth */}
                <Route path='/connections/add/confluent' exact={true} element={<ConnectionAddConfluent/>}/>
                <Route path='/connections/confluent/:connectionName/environments' element={<ConfluentEnvironmentList/>}/>
                <Route path='/connections/confluent/:connectionName/:envId/clusters' element={<ConfluentClusterList/>}/>
                <Route path='/connections/confluent/:connectionName/:envId/:clusterId/topics' element={<ConfluentTopicList/>}/>

            </Routes>
        </Router>
    )
}

export default App;
