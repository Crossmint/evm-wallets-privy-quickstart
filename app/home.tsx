"use client";

import Image from "next/image";
import { WalletBalance } from "@/components/balance";
import { TransferFunds } from "@/components/transfer";
import { DelegatedSigner } from "@/components/delegated-signer";
import { LogoutButton } from "@/components/logout";
import { LoginButton } from "@/components/login";
import { usePrivyConnector } from "@/hooks/usePrivyConnector";

export function HomeContent() {
  const { crossmintWallet, crossmintWalletStatus, isLoading } =
    usePrivyConnector();

  const walletAddress = crossmintWallet?.address;
  const isLoggedIn =
    crossmintWallet != null && crossmintWalletStatus === "loaded";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center">
        <Image
          src="/crossmint.svg"
          alt="Crossmint logo"
          priority
          width={150}
          height={150}
        />
        <h1 className="text-xl font-medium">EVM Wallets Quickstart (Privy)</h1>
        <div className="max-w-md mt-3 w-full min-h-[38px]">
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col mb-8">
        <Image
          src="/crossmint.svg"
          alt="Crossmint logo"
          priority
          width={150}
          height={150}
          className="mb-4"
        />
        <h1 className="text-2xl font-semibold mb-2">
          EVM Wallets Quickstart (Privy)
        </h1>
        <p className="text-gray-600 text-sm">
          The easiest way to build onchain
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white flex flex-col gap-3 justify-between rounded-xl border shadow-sm p-5 overflow-hidden">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-lg font-medium">Your wallet</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] text-gray-500">
                    {walletAddress
                      ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(
                          -4
                        )}`
                      : ""}
                  </p>
                  <button
                    onClick={() => {
                      if (walletAddress) {
                        navigator.clipboard.writeText(walletAddress);
                        const button =
                          document.activeElement as HTMLButtonElement;
                        button.disabled = true;
                        const originalContent = button.innerHTML;
                        button.innerHTML = `<img src="/check.svg" alt="Check" width="16" height="16" />`;
                        setTimeout(() => {
                          button.innerHTML = originalContent;
                          button.disabled = false;
                        }, 2000);
                      }
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Image src="/copy.svg" alt="Copy" width={16} height={16} />
                  </button>
                </div>
                <div className="relative group">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {process.env.NEXT_PUBLIC_CHAIN}
                  </div>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      Current network
                    </div>
                    <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            <WalletBalance />
          </div>
          <LogoutButton />
        </div>
        <TransferFunds />
        <DelegatedSigner />
      </div>
    </div>
  );
}
