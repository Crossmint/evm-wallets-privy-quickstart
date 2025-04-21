"use client";

import { useEffect } from "react";
import {
  useCrossmint,
  useWallet as useCrossmintWallet,
} from "@crossmint/client-sdk-react-ui";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export const usePrivyConnector = () => {
  const { setJwt } = useCrossmint();
  const {
    getOrCreateWallet: getOrCreateCrossmintWallet,
    status: crossmintWalletStatus,
    error: crossmintWalletError,
    wallet: crossmintWallet,
  } = useCrossmintWallet();

  const { ready, authenticated, getAccessToken } = usePrivy();
  const { wallets: privyWallets, ready: privyReady } = useWallets();

  useEffect(() => {
    const syncPrivyJwt = async () => {
      try {
        const privyJwt = await getAccessToken();
        if (privyJwt != null) {
          setJwt(privyJwt);
        }
      } catch (error) {
        setJwt(undefined);
        console.error("Failed to get Privy JWT:", error);
      }
    };

    if (ready && authenticated) {
      syncPrivyJwt();
    }
  }, [ready, authenticated, getAccessToken, setJwt]);

  const privyEmbeddedWallet =
    privyWallets?.find((wallet) => wallet.walletClientType === "privy") ?? null;

  useEffect(() => {
    const createCrossmintWallet = async () => {
      if (!privyEmbeddedWallet || !authenticated || !ready) {
        return;
      }
      const privyProvider = await privyEmbeddedWallet.getEthereumProvider();
      try {
        await getOrCreateCrossmintWallet({
          type: "evm-smart-wallet",
          args: {
            adminSigner: {
              type: "evm-keypair",
              address: privyEmbeddedWallet.address,
              signer: {
                type: "provider",
                provider: {
                  // @ts-ignore something wrong with EIP1193Provider type from our wallets sdk
                  on: privyProvider.on.bind(privyProvider),
                  removeListener:
                    privyProvider.removeListener.bind(privyProvider),
                  // @ts-ignore something wrong with EIP1193Provider type from our wallets sdk
                  request: privyProvider.request.bind(privyProvider),
                },
              },
            },
          },
        });
      } catch (error) {
        console.error("Failed to create Crossmint wallet:", error);
      }
    };
    createCrossmintWallet();
  }, [privyEmbeddedWallet, authenticated, ready]);

  return {
    privyEmbeddedWallet,
    crossmintWallet,
    crossmintWalletStatus,
    crossmintWalletError,
    isLoading: crossmintWalletStatus === "in-progress" || !privyReady,
  };
};
