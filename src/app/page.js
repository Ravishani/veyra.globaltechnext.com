import Image from "next/image";
import Header from "./layouts/header";
import Banner from "./homepage/banner";
import MarketRates from "./homepage/MarketRates";
import ProductsPage from "./homepage/product";

export default function Home() {
  return (
    <>
     
      <Banner/>
      {/* <MarketRates/> */}
      <ProductsPage/>
    </>
  );
}
