interface FooterMsgProps {
	label: string;
	linkText: string;
	onFocus?: () => void;
	onClick?: () => void;
}

export default function FooterMsg({
	label,
	linkText,
	onClick,
	onFocus,
}: FooterMsgProps) {
	return (
		<section className="flex gap-2">
			<span>{label}</span>
			<button
				type="button"
				onFocus={onFocus}
				onClick={onClick}
				className="text-secondary hover:text-primary cursor-pointer font-bold transition duration-1000"
			>
				{linkText}
			</button>
		</section>
	);
}
