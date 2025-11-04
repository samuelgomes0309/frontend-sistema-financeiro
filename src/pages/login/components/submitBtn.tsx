interface SubmitBtnProps {
	label: string;
}

export default function SubmitBtn({ label }: SubmitBtnProps) {
	return (
		<button
			type="submit"
			className="bg-primary hover:bg-secondary my-4 flex w-full cursor-pointer items-center justify-center rounded-xl p-2 font-black text-white transition duration-1000"
		>
			{label}
		</button>
	);
}
