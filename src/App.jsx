import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x5fe72290384A5F00B277f011A7341a212c0DE83B";

function App() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  async function requestAccount() {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setErrorMessage("Only MetaMask is supported. Please install MetaMask.");
      throw new Error("MetaMask not found");
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (err) {
      setErrorMessage("User denied wallet connection.");
      throw err;
    }
  }

  const handleSet = async () => {
    setErrorMessage("");
    setSuccessMessage(""); // resetting the error

    try {
      if (!text) {
        setErrorMessage("Please enter a message before setting.");
        return;
      }


      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.setMessage(text);
      const txReceipt = await tx.wait();
      setSuccessMessage(`Transaction successful: ${txReceipt.transactionHash}`);
    }
    catch (error) {
      console.error("Error setting message:", error);
      setErrorMessage(error.message || error);
    }
  };

  const handleGet = async () => {
    setErrorMessage("");
    setSuccessMessage(""); // resetting messages


    try {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const message = await contract.getMessage();
      setReply(message);
    }
    catch (error) {
      console.error("Error getting message:", error);
      setErrorMessage(error.message || error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Onchain Message Dapp</h1>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttonGroup}>
          <button onClick={handleSet} style={styles.button}>Set Message</button>
          <button onClick={handleGet} style={styles.button}>Get Message</button>
        </div>

        {reply && (
          <div style={styles.result}>
            <h2>Message from Contract:</h2>
            <p>{reply}</p>
          </div>
        )}

        {errorMessage && (
          <div style={{ ...styles.message, color: "red" }}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{ ...styles.message, color: "green" }}>
            <strong>Success:</strong> {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
    wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    
  },
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "lightgray",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  input: {
    width: "80%",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "15px",
    border: "1px solid #ddd",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    flex: "1",
    backgroundColor: "purple",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  result: {
    marginTop: "20px",
    fontSize: "12px",
    padding: "10px",
    backgroundColor: "#f8f9fa",

    borderRadius: "4px",
  },
  message: {
    marginTop: "15px",
    fontSize: "16px",
  },
};

export default App;