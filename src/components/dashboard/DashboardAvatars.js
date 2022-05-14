import Avatar from "./Avatar";

const DashboardAvatar = ({socket, allUsers}) => {


    return(
        <div id="dashboard-avatars">
            {allUsers.map((user, index) => <div className="avatar" key={index}><p>{user.socket}</p></div>) }
        </div>
    );

}


export default DashboardAvatar