import { ThemeProvider } from "styled-components"
import { defaultTheme } from "./styles/themes/detault"
import { Router } from "./Router"
import { BrowserRouter } from "react-router-dom"
import { GlobalStyle } from "./styles/global"
import { CyclesContextProvider } from "./contexts/CyclesContext"

function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CyclesContextProvider >
          <Router />
        </CyclesContextProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
