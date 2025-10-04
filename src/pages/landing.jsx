import React from "react";
import Header from "../components/landing/jsx/Header";
import Hero from "../components/landing/jsx/Hero";
import CTAbtns from "../components/landing/jsx/CTAbtns";
import Services from "../components/landing/jsx/Services";
import ScrollStack, {
  ScrollStackItem,
} from "../components/bits/jsx/ScrollStack";
import "./landing.css";
export default function Landing() {
  return (
    <div className="landing">
      <Header />

      <CTAbtns />

      <Hero />

      <Services />
    </div>
  );
}
