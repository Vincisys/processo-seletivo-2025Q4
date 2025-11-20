import { RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { router } from "./routes";

const rootElement = document.getElementById("app");

if (!rootElement) {
	throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<RouterProvider router={router} />);
}
