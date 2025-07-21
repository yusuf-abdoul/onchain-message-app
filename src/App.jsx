import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x5fe72290384A5F00B277f011A7341a212c0DE83B";

function App() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        setError("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      setError("Error setting message:", error);
      alert(error.message || error);
    }
  };

  const handleGet = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const message = await contract.getMessage();
        setReply(message);
      }
      else {
        setErrorMessage("Metamask not connected. Please connect your wallet.");
        alert("Please connect your wallet to get the message.");
      }
    } catch (error) {
      setError("Error getting message:", error);
      alert(error.message || error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set Message on Smart Contract</h1>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSet}>Set Message</button>
      <button onClick={handleGet}>Get Message</button>
      {reply && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Message from Contract:</h2>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}

export default App;