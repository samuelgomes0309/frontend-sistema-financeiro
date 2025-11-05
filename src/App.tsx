import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Private from "./routes/PrivateRoute";
import Public from "./routes/PublicRoute";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Private>
				<Dashboard />
			</Private>
		),
	},
	{
		path: "/login",
		element: (
			<Public>
				<Login />
			</Public>
		),
	},
]);

export default router;
