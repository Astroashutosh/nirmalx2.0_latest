import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../utils/walletService";

function ConnectButton() {
  const dispatch = useDispatch();
  const { address, isConnected } = useSelector((state) => state.wallet);

  return (
    <>
      {isConnected ? (
        <button>
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
      ) : (
        <button onClick={() => connectWallet(dispatch)}>
          Connect Wallet
        </button>
      )}
    </>
  );
}

export default ConnectButton;
