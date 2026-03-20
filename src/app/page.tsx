"use client"

import HeroSection from "./component/herosection";
import Navbar from "./component/navbar";
import WhatWeDo from "./component/whatwedo";
export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection/>
      <WhatWeDo/>
    </div>
  );
}
