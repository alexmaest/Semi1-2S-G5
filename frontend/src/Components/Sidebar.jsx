import React, { Component } from "react";
import { Link } from "react-router-dom";
import { BsChatSquareDotsFill } from "react-icons/bs";
import { GoDependabot } from "react-icons/go";
import { CgProfile} from "react-icons/cg";
import { AiFillHome } from "react-icons/ai";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiLogoutBoxRLine } from "react-icons/ri";

class Sidebar extends Component {
    Logout = () => {
        alert("Logout");
    };

    render() {
        return(
            <div className="sidebar-cont sideborder">
                <div className="side-title-options">
                    <Link to={""} className="side-title">
                    SemiSocial
                    </Link>
                </div>
                <nav>
                    <ul className="noliststyle">
                    <li className="side-list-options">
                        <Link to={"/inicio"} className="sideitems">
                        <AiFillHome className="sideicon"/> {" "}|
                        Inicio
                        </Link>
                    </li>
                    <li className="side-list-options">
                        <Link to={"/perfil"} className="sideitems">
                        <CgProfile className="sideicon"/>{" "}|
                        Perfil
                        </Link>
                    </li>
                    <li className="side-list-options">
                        <Link to={"/friends"} className="sideitems">
                        <LiaUserFriendsSolid className="sideicon" /> {" "}|
                        Amigos
                        </Link>
                    </li>
                    <li className="side-list-options">
                        <Link to={"/chat"} className="sideitems">
                        <BsChatSquareDotsFill className="sideicon" /> {" "}|
                        Chat
                        </Link>
                    </li>
                    <li className="side-list-options">
                        <Link to={"/bot"} className="sideitems">
                        <GoDependabot className="sideicon"/> {" "}|
                        Bot
                        </Link>
                    </li>
                    </ul>
                </nav>
                <div className="side-logout">
                    <Link to={"/"} onClick={this.Logout} className="sideitems">
                    <RiLogoutBoxRLine className="sideicon"/> {" "}|
                    Logout
                    </Link>
                </div>
            </div>
        )
    }
}

export default Sidebar;