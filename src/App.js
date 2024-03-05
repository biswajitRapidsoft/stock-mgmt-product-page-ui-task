// import './App.css';
import Routing from "./routes/Routing";
import Navbar from "./components/Navbar";
import Sidenav from "./components/Sidebar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Sidenav />
      <Routing />
    </div>
  );
}

export default App;
