import Header from "../../components/header";
import Sidebar from "../../components/sidebar";

export default function Register() {
	return (
		<div className="bg-background-light flex min-h-screen min-w-full flex-col md:flex-row">
			<Sidebar />
			<main className="flex w-full">
				<Header title="Registrar" />
			</main>
		</div>
	);
}
