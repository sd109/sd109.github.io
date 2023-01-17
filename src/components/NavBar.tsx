import { Link } from "react-router-dom";
import { capitalise } from "../utils/strings";
import { router } from "../App"

type NavItemProps = {target: string, name?: string}

function NavItem(props: NavItemProps) {

    let targetFormatted = props.name ? props.name : capitalise(props.target)

    return (
        <div className="nav-item">
            <Link to={props.target}>{targetFormatted}</Link>
        </div>
    )
}

export function NavBar() {

    return (
        <div className="nav-bar">
            <NavItem target="/" name="Home" />
            <NavItem target="about" />
            <NavItem target="test" />
        </div>
    )
}