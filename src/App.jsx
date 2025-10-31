import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/landing"
import WebDesign from "./pages/Services/jsx/WebDesign"
import MobileApp from "./pages/Services/jsx/MobileApp"
import Marketing from "./pages/Services/jsx/Marketing"
import SEO from "./pages/Services/jsx/SEO"
import ScrollStack from "./components/bits/jsx/test"
import Goals from "./pages/About/jsx/Goals"
import Contact from "./pages/Contact/jsx/Contact"
import Signup from "./pages/login/jsx/signup"
import Login from "./pages/login/jsx/login"
import ConfirmationSuccess from "./pages/login/jsx/done"
import EmailVerificationPage from "./pages/login/jsx/EmailVerificationPage"
import Dashboard from "./pages/dashboard/jsx/main"
import ProjectsManagementPage from "./pages/dashboard/jsx/projects"
import ProjectDetails from "./pages/dashboard/jsx/project"
import BillingAndPayments from "./pages/dashboard/jsx/BillingAndPayments"
import ReferralProgram from "./pages/dashboard/jsx/ReferralProgram"
import Feedback from "./pages/dashboard/jsx/Feedback"
import ToolsPage from "./pages/dashboard/jsx/Tools"
import Tool_ImageToSite from "./pages/dashboard/jsx/Tool_ImageToSite"
import Tool_TextToArticle from "./pages/dashboard/jsx/Tool_TextToArticle"
import SiteViewer from "./pages/site/SiteViewer"
import SiteViewerGeneric from "./pages/site/SiteViewerGeneric"
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/done" element={<ConfirmationSuccess />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/tools" element={<ToolsPage />} />
        <Route path="/dashboard/tools/image-to-site" element={<Tool_ImageToSite />} />
        <Route path="/dashboard/tools/text-to-article" element={<Tool_TextToArticle />} />
        <Route path="/projects" element={<ProjectsManagementPage />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/billing" element={<BillingAndPayments />} />
        <Route path="/referral" element={<ReferralProgram />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/image-to-site" element={<Tool_ImageToSite />} />
        <Route path="/tools/text-to-article" element={<Tool_TextToArticle />} />
        <Route path="/:username/image-to-site/:ordinal" element={<SiteViewer />} />
        <Route path="/:username/:toolId/:ordinal" element={<SiteViewerGeneric />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
