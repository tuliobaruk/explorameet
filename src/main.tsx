import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/router";
import { ToastContainer } from "react-toastify";

import "@/index.css";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
			<ToastContainer position="top-right" autoClose={3000} pauseOnHover={false} />
		</AuthProvider>
	</StrictMode>,
);
