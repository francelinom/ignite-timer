import { ThemeProvider } from "styled-components"
import { defaultTheme } from "./styles/themes/detault"
import { Router } from "./Router"
import { BrowserRouter } from "react-router-dom"
import { GlobalStyle } from "./styles/global"

function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
