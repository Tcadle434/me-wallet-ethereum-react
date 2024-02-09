import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { providers } from "ethers";

const CHECK_INTERVAL_MS = 1000;
const TIMEOUT_MS = 3000;

/**
 * Custom hook to get the provider object. It checks for the provider object
 * every second and redirects to the website to download the wallet extension if the
 * provider is not found after 3 seconds.
 * @returns {Web3Provider | undefined} The MagicEdenProvider object
 */
export const useMagicEdenProvider = (): Web3Provider | undefined => {
  const [provider, setProvider] = useState<Web3Provider | undefined>();
  const [found, setFound] = useState(false);

  useEffect(() => {
    // Immediate check to avoid waiting for the interval
    const checkProvider = () => {
      if ("magicEden" in window) {
        const anyWindow: any = window;
        const magicProvider = anyWindow.magicEden?.ethereum;
        if (magicProvider?.isMagicEden) {
          const provider = new providers.Web3Provider(magicProvider);
          setProvider(provider);
          setFound(true);
          return true;
        }
      }
      return false;
    };

    // early return if provider is already found
    if (checkProvider()) return;

    const interval = setInterval(() => {
      if (checkProvider()) clearInterval(interval);
    }, CHECK_INTERVAL_MS);

    const timeout = setTimeout(() => {
      if (!found) {
        window.location.href = "https://wallet.magiceden.io/";
        clearInterval(interval);
      }
    }, TIMEOUT_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [found]);

  return provider;
};
