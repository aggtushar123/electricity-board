import Home from "./pages/Home";
import Connection from "./pages/Connection";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EditConnection from "./pages/connections/EditConnection";

function App() {
	return (
		<div>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" exact element={<Home />}></Route>
					<Route path="/connection" exact element={<Connection />}></Route>

					<Route
						path="/editconnection/:id"
						exact
						element={<EditConnection />}
					></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
