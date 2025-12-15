import logo from './images/Arxiki_eikona.png';
import owner from './images/owner.png';
import vet from './images/vet.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <img src={owner} className="owner-image" alt="owner" />
        <img src={vet} className="owner-image" alt="vet" />
        <p>
          {/* Edit <code>src/App.js</code> and save to reload. */}
          Γεια σου React
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React 
        </a>
      </header>
    </div>
  );
}

export default App;
