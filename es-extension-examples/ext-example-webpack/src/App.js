import logo from './logo.svg';
import './App.css';

function App() {
  const logoUrl = `http://localhost:9093/${logo}`

  const css = `
  .App {
    text-align: center;
    background-color: #282c34;

    /* fill top bar */
    position: absolute;
    overflow: auto;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
  
  .App-logo {
    height: 5em;
    pointer-events: none;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    .App-logo {
      animation: App-logo-spin infinite 20s linear;
    }
  }
  
  .App-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }
  
  .App-link {
    color: #61dafb;
  }
  
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
    `

  return (
    <>
      <style>{css}</style>
      <div className="App">
        <header className="App-header">
          <img src={logoUrl} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
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
    </>
  );
}

export default App;
