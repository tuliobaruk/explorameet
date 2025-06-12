interface AuthDividerProps {
	text: string;
}

export default function AuthDivider({ text }: AuthDividerProps) {
	return (
		<div className="auth-divider">
			<span className="auth-divider-text">{text}</span>
		</div>
	);
}
