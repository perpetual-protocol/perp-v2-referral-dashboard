import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import React from "react";
import { useState } from "react";
import Jazzicon from "react-jazzicon";
import Button, { Size } from "./Button";
import Modal from "./Modal";

import WalletConnectLogo from "../assets/walletconnect.svg";
import Wallet from "../assets/wallet.svg";

import MetamaskLogo from "../assets/metamask.svg";
import TorusLogo from "../assets/torus.svg";
import CoinbaseLogo from "../assets/coinbase.svg";

import { useEffect } from "react";
import { useGlobalState } from "../AppStateHolder";
import { WalletConnectConnector } from "../utils/WalletConnectConnector";

type Props = {
  size?: Size;
};

const RPC_URLS = {
  10: "https://mainnet.optimism.io",
};

export enum ConnectorNames {
  Injected = "Metamask",
  WalletConnect = "Wallet Connect",
  WalletlinkConnect = "Coinbase Wallet",
  TorusConnect = "Torus Wallet",
}

const LogoMap = {
  [ConnectorNames.Injected]: MetamaskLogo,
  [ConnectorNames.WalletConnect]: WalletConnectLogo,
  [ConnectorNames.WalletlinkConnect]: CoinbaseLogo,
  [ConnectorNames.TorusConnect]: TorusLogo,
};

export const injected = new InjectedConnector({});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [10],
  qrcode: true,
  rpc: RPC_URLS,
});
export const walletLinkConnect = new WalletLinkConnector({
  url: RPC_URLS[10],
  appName: "perp-exchange",
});

export const torusConnect = new TorusConnector({
  chainId: 10,
  initOptions: {
    network: {
      host: RPC_URLS[10],
      chainId: 10,
    },
  },
});
export const activateInjectedProvider = (
  providerName = ConnectorNames.Injected
) => {
  const { ethereum } = window;

  if (!ethereum?.providers) {
    return undefined;
  }
  console.log("providerName", providerName);

  let provider;
  switch (providerName) {
    case ConnectorNames.WalletlinkConnect:
      provider = ethereum.providers.find(
        ({ isCoinbaseWallet }: any) => isCoinbaseWallet
      );
      break;
    case ConnectorNames.Injected:
      provider = ethereum.providers.find(({ isMetaMask }: any) => isMetaMask);
      break;
    default:
      provider = ethereum.providers.find(({ isMetaMask }: any) => isMetaMask);
  }

  if (provider) {
    ethereum.setSelectedProvider(provider);
  }
};
export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletlinkConnect]: walletLinkConnect,
  [ConnectorNames.TorusConnect]: torusConnect,
};

function shortenAddress(str) {
  return str.substr(0, 5) + "..." + str.substr(str.length - 4, str.length);
}

export default function WalletConnect({ size = "sm" }: Props) {
  const { activate, deactivate, error, active } = useWeb3React();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { canAccessApp, account, setViewOnlyAddress } = useGlobalState();
  useEffect(() => {
    console.log("=====");
    // async function test() {
    //   await import("@coinbase/wallet-sdk")
    //     .then((m) => {
    //       console.log("dyninic", m);

    //       return m?.default ?? m;
    //     })
    //     .then((coinbaseSD) => {
    //       coinbaseSD;
    //     })
    //     .catch((error) => console.error("error", error));
    // }

    // test();
    // async function test() {
    //   await walletLinkConnect.activate().then(console.log).catch("test", error);
    // }
    // test();
  }, []);
  useEffect(() => {
    console.error("err", error);
  }, [error]);

  const activateWallet = async (name: ConnectorNames) => {
    console.log("name", name);

    if (
      name === ConnectorNames.Injected ||
      name === ConnectorNames.WalletlinkConnect
    ) {
      activateInjectedProvider(name);
    }
    setIsModalVisible(false);
    await activate(
      connectorsByName[name],
      (err) => {
        console.error("activate" + err);
      },
      true
    );
  };

  const disconnect = () => {
    if (active) {
      deactivate();
    }
    setViewOnlyAddress("");
    setIsModalVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const buttonType = canAccessApp ? "secondary" : "primary";
  const icon = canAccessApp ? (
    <Jazzicon diameter={17} seed={parseInt(account)} />
  ) : (
    <Wallet />
  );

  return (
    <div>
      <Button
        type={buttonType}
        size={size}
        onClick={() => setIsModalVisible(true)}
        icon={icon}
      >
        {canAccessApp && shortenAddress(account)}
        {!canAccessApp && "Connect Wallet"}
      </Button>
      {isModalVisible && (
        <Modal onClose={closeModal}>
          <div className="bg-perp-gray-300 rounded-lg flex flex-col justify-between">
            <h3 className="text-md text-center text-white font-medium mb-4">
              Choose Wallet
            </h3>
            {Object.keys(connectorsByName).map((connector) => {
              const Logo = LogoMap[connector];
              return (
                <Button
                  key={`connector-${connector}`}
                  icon={<Logo />}
                  isFullWidth
                  className="mb-2"
                  type="secondary"
                  size="sm"
                  onClick={() => activateWallet(connector as ConnectorNames)}
                >
                  {connector}
                </Button>
              );
            })}
            {canAccessApp && (
              <Button
                isFullWidth
                size="sm"
                onClick={disconnect}
                type="destructive"
              >
                Disconnect
              </Button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
