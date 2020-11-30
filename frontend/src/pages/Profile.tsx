import * as React from 'react'
import { withAuth } from "../lib/AuthProvider";
import Sidebar from '../components/Sidebar'
import Avatar from '@material-ui/core/Avatar';
// import {useLocation} from "react-router-dom";

interface ProfileProps {
    logout: () => any
}


class Profile extends React.Component<ProfileProps> {
    render() {

        return (
            <div>
                <Sidebar logout={this.props.logout}/>
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", height:"60vh", backgroundColor:"purple"}}>
                    <Avatar style={{padding:"6em", margin: "1.7em 0em 1em 0em", backgroundColor:"#212121"}} alt="Remy Sharp"><img src="/favicon.ico"/> </Avatar>
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <h1 style={{margin:"0", color:"white"}}>Rose Beatty</h1>
                        <p style={{margin:"0", color:"lightgreen"}}>Online</p>
                    </div>
                </div>
                <button style={{padding:"1.2em 2.8em", margin:"3.7em 2em 2em 2em", backgroundColor:"#3F51B5", color:"white", border:"none", borderRadius:"3px"}}>Start a Conversation</button>
                <p>Delete account</p>
                {/* <p>More actions</p> */}
            </div>
        )
    }
}

export default withAuth(Profile)
