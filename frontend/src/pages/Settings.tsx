import * as React from 'react'
import { withAuth } from "../lib/AuthProvider";

class Settings extends React.Component {
    render() {
        return(
            <div>Welcome to settings</div>
        )
    }
}

export default withAuth(Settings)
