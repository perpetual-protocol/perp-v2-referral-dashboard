import React from "react"
import { render } from "react-dom"
import App from "./App"
import "./styles/tailwind.css"
import "./index.css"

declare global {
    interface Window {
        ethereum: any
    }
}
render(<App />, document.getElementById("root"))
