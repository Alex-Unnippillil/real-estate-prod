import React from "react";
import HeroSection from "@client/app/(nondashboard)/landing/HeroSection";
import FeaturesSection from "@client/app/(nondashboard)/landing/FeaturesSection";
import DiscoverSection from "@client/app/(nondashboard)/landing/DiscoverSection";
import CallToActionSection from "@client/app/(nondashboard)/landing/CallToActionSection";
import FooterSection from "@client/app/(nondashboard)/landing/FooterSection";

const Landing = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
