"use client";

import {
  CrossmintProvider,
  CrossmintWalletProvider,
  isValidEVMChain,
} from "@crossmint/client-sdk-react-ui";
import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
const crossmintApiKey = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY ?? "";

if (!privyAppId || !crossmintApiKey) {
  throw new Error(
    "NEXT_PUBLIC_PRIVY_APP_ID or NEXT_PUBLIC_CROSSMINT_API_KEY is not set"
  );
}

if (!process.env.NEXT_PUBLIC_CHAIN) {
  throw new Error("NEXT_PUBLIC_CHAIN is not set");
}

if (!isValidEVMChain(process.env.NEXT_PUBLIC_CHAIN)) {
  throw new Error("NEXT_PUBLIC_CHAIN is not a valid EVM chain");
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ["wallet", "email", "google", "passkey"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <CrossmintProvider apiKey={crossmintApiKey}>
        <CrossmintWalletProvider>{children}</CrossmintWalletProvider>
      </CrossmintProvider>
    </PrivyProvider>
  );
}
