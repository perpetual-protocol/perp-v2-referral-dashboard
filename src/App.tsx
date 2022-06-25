import React, { useEffect } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./views/home/Home";
import DownloadBanner from "./views/download-banner/DownloadBanner";
import { Web3Provider } from "@ethersproject/providers";
import { useState } from "react";
import Toast from "./components/Toast";
import { useContext } from "react";
import * as echarts from "echarts/core";
import { LineChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Route } from "wouter";
import Report from "./views/report/Report";
import AppStateProvider from "./AppStateHolder";
import Admin from "./views/admin/Admin";
import { PERP_DOMAIN } from "./hooks/useReferral";
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
  BarChart,
]);

const queryClient = new QueryClient();

export const ToastContext = React.createContext<any>(null);
export const useToast = () => useContext(ToastContext);

function getLibrary(provider: any) {
  return new Web3Provider(provider);
}

const getPreAppliedCode = () => {
  const urlQuery = new URLSearchParams(window.location.search);
  const preAppliedCode = urlQuery.get("code");
  return preAppliedCode || "";
};

export default function App() {
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState<"normal" | "error">("normal");
  const showToast = (text: string, type: "error" | "normal" = "normal") => {
    setToastType(type);
    setIsToastVisible(true);
    setToastText(text);
    setTimeout(() => {
      setIsToastVisible(false);
      setToastText("");
    }, 4000);
  };

  useEffect(() => {
    const code = getPreAppliedCode();
    if (code) {
      window.location.replace(`${PERP_DOMAIN}?code=${code}`);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
        <QueryClientProvider client={queryClient}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <AppStateProvider>
              <div className="flex flex-col w-full h-full font-body subpixel-antialiased">
                <Route path="/" component={Home} />
                <Route path="/report" component={Report} />
                <Route path="/admin" component={Admin} />
                <Route path="/banner" component={DownloadBanner} />
              </div>
            </AppStateProvider>
          </Web3ReactProvider>
        </QueryClientProvider>
        <Toast isVisible={isToastVisible} text={toastText} type={toastType} />
    </ToastContext.Provider>
  );
}
