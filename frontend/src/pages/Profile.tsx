import * as React from 'react'
import { withAuth } from "../lib/AuthProvider";
import Sidebar from '../components/Sidebar'
// import {useLocation} from "react-router-dom";

interface ProfileProps {
    logout: () => any
}

class Profile extends React.Component<ProfileProps> {
    render() {
        return (
            <div>
                <Sidebar logout={this.props.logout}/>
                <h2>Welcome to your profile</h2>
                <p>Upload a profile picture</p>
                <p>Set your availabilty</p>
                <p>Delete your account</p>
                <p>More actions</p>
            </div>
        )
    }
}

export default withAuth(Profile)
