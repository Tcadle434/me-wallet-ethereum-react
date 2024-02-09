import { useConnectionStatus } from "./context/connectionStatus";
import { NoProvider } from "./components/NoProvider";
import { sendTransaction } from "./utils/sendTransaction";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  const { isConnected, provider, address, connect } = useConnectionStatus();

  if (!provider) {
    return <NoProvider />;
  }

  async function signWalletMessage() {
    try {
      const signer = await provider?.getSigner();
      await signer!.signMessage(
        "Hello, World! 🌍 Welcome to the Magic Eden wallet on Ethereum"
      );
      toast.success("Message signed successfully!");
    } catch (error) {
      toast.error(`Error signing message: ${error}`);
    }
  }

  async function sendWalletTransaction() {
    try {
      const tx = await sendTransaction(provider!);
      toast.promise(
        tx.wait(),
        {
          loading: "Sending transaction...",
          success: "Transaction sent!",
          error: "Error sending transaction",
        },
        {
          style: {
            background: "#363636",
            color: "#fff",
          },
        }
      );
    } catch (error) {
      toast.error(`Error sending transaction: ${error}`);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {isConnected ? (
        <div className="text-gray-200 text-center flex flex-col items-center">
          Connected Wallet:
          <br />
          {address}
          <button
            onClick={signWalletMessage}
            className="bg-[#e93a88] text-white rounded font-semibold px-4 py-2 mt-4"
          >
            Sign Message
          </button>
          <button
            onClick={sendWalletTransaction}
            className="bg-[#e93a88] text-white rounded font-semibold px-4 py-2 mt-4"
          >
            Send Transaction
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="bg-[#e93a88] text-white rounded font-semibold px-4 py-2"
        >
          Connect Wallet
        </button>
      )}
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;
