import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/landing"
import WebDesign from "./pages/Services/jsx/WebDesign"
import MobileApp from "./pages/Services/jsx/MobileApp"
import Marketing from "./pages/Services/jsx/Marketing"
import SEO from "./pages/Services/jsx/SEO"
import ScrollStack from "./components/bits/jsx/test"
import Goals from "./pages/About/jsx/Goals"
import Contact from "./pages/Contact/jsx/Contact"
import "./App.css"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/services/webdesign" element={<WebDesign />} />
        <Route path="/services/mobileapp" element={<MobileApp />} />
        <Route path="/services/marketing" element={<Marketing />} />
        <Route path="/services/seo" element={<SEO />} />
        <Route path="/about/goals" element={<Goals />} />
        <Route path="/test" element={<ScrollStack />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
