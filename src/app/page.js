import Image from "next/image";
import Header from "./layouts/header";
import Banner from "./homepage/banner";
import MarketRates from "./homepage/MarketRates";

export default function Home() {
  return (
    <>
      <Header />
      <Banner/>
      {/* <MarketRates/> */}
    </>
  );
}
