import React from "react";
// import styles from "../style/pages/home.module.css";

import Hero from "../component/components/homecomponent/Hero";
import Why from "../component/components/homecomponent/Why";
import FeaturedProducts from "../component/components/homecomponent/FeaturedProduct";
import Newsletter from "../component/components/homecomponent/NewsLetter";

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Why />
      <FeaturedProducts />
      <Newsletter />
    </div>
  );
};

export default Home;
