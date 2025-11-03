import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./App.tsx";
import { AuthContextProvider } from "./contexts/authContext.tsx";

createRoot(document.getElementById("root")!).render(
	<AuthContextProvider>
		<RouterProvider router={router} />
	</AuthContextProvider>
);
