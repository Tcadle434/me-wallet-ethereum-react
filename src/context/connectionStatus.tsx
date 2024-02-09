import { useState, createContext, useContext, FC, ReactNode } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useMagicEdenProvider } from "../utils/getProvider";

interface ConnectionStatusContextType {
  isConnected: boolean;
  provider: Web3Provider | undefined;
  address: any | undefined;
  connect: () => Promise<void>;
}

export const ConnectionStatusContext =
  createContext<ConnectionStatusContextType | null>(null);

export const useConnectionStatus = () => {
  const context = useContext(ConnectionStatusContext);
  if (!context) {
    throw new Error(
      "useConnectionStatus must be used within a ConnectionStatusProvider"
    );
  }
  return context;
};

export const ConnectionStatusProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const provider = useMagicEdenProvider();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<any>();

  const connect = async () => {
    if (!provider) return;
    try {
      const signerAddress = await provider!.send("eth_requestAccounts", []);
      setIsConnected(true);
      setAddress(signerAddress);
    } catch (err) {
      console.error(err);
    }
  };

  const value = { isConnected, provider, address, connect };

  return (
    <ConnectionStatusContext.Provider value={value}>
      {children}
    </ConnectionStatusContext.Provider>
  );
};
