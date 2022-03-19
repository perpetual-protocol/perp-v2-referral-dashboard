import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "../../components/Button";
import ConnectWallet from "../connect-wallet/ConnectWallet";
import AppNav from "../app-nav/AppNav";

import { useGlobalState } from "../../AppStateHolder";
import useReferral from "../../hooks/useReferral";
import { refereeTiers } from "../../hooks/useRewards";

export default function DownloadBanner(props: unknown) {
  const { canAccessApp } = useGlobalState();

  const [shape, setShape] = useState("rect");
  const [url, setUrl] = useState("");

  const urlPrefix = "https://perp.ml/refBanner";

  const { referralCode, vipTier } = useReferral();

  useEffect(() => {
    const discount = refereeTiers[vipTier]["rebate"] * 100;

    setUrl(
      `${urlPrefix}?refCode=${referralCode}&shape=${shape}&discount=${discount}`
    );
  }, [shape, referralCode]);

  const downloadImage = async () => {
    const image = await axios({
      url: url,
      method: "GET",
      responseType: "blob", // important
    });

    const blob = new Blob([image.data], { type: "image/png" });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `banner-${referralCode}-${shape}-${+new Date()}.png`;
    link.click();
  };

  return (
    <div>
      <AppNav />
      <div className="flex flex-col self-center justify-center items-center w-full h-full font-body subpixel-antialiased">
        {!canAccessApp && <ConnectWallet />}
        {canAccessApp && (
          <div style={{ maxWidth: "1200px" }} >
            <div>
              <h1 className="text-white text-2xl font-bold">
                Generate Referral Code Banner
              </h1>
              <p className="text-perp-gray-200">
                Select a shape and download a special banner.
              </p>

              <div className="flex items-center my-4">
                <div className="flex w-48 mr-4 text-white justify-evenly">
                  <div>
                    <input
                      type="radio"
                      checked={shape === "rect"}
                      onChange={() => {
                        setShape("rect");
                      }}
                    />
                    <label>Rectangle</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      checked={shape === "square"}
                      onChange={() => {
                        setShape("square");
                      }}
                    />
                    <label>Square</label>
                  </div>
                </div>

                <div>
                  <Button onClick={downloadImage}>Download</Button>
                </div>
              </div>

              <div>
                <img height="500" width="500" src={url} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
