import { Link } from "react-router-dom";

interface AuthSwitchLinkProps {
	mainText: string;
	linkText: string;
	linkTo: string;
}

export default function AuthSwitchLink({ mainText, linkText, linkTo }: AuthSwitchLinkProps) {
	return (
		<p className="auth-switch-link-text">
			{mainText}{" "}
			<Link to={linkTo} className="auth-link">
				{linkText}
			</Link>
		</p>
	);
}
