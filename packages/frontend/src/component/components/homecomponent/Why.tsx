import React from "react";
import { Truck, Shield, Zap } from "lucide-react";
import Container from "../../../style/component/ui/Container";
import Feature from "../homecomponent/whycard/FeatureCard";
import styles from "./why.module.css";

const Why: React.FC = () => {
  const features = [
    {
      icon: <Truck />,
      title: "Free Shipping",
      description:
        "Free delivery on orders over $50 with our express shipping network",
      iconClass: "icon1",
    },
    {
      icon: <Shield />,
      title: "Secure Payment",
      description:
        "Your payment information is protected with bank-level security",
      iconClass: "icon2",
    },
    {
      icon: <Zap />,
      title: "Fast Delivery",
      description:
        "Get your orders in 2-3 business days anywhere in the country",
      iconClass: "icon3",
    },
  ];

  return (
    <div className={styles.why}>
      <Container>
        <h3 className={styles.sectionTitle}>Why Choose Us</h3>
        <p className={styles.sectionSubtitle}>
          Experience the difference with our premium service
        </p>
        <div className={styles.whyFeatures}>
          {features.map((f, index) => (
            <Feature
              key={index}
              icon={f.icon}
              title={f.title}
              description={f.description}
              iconClass={f.iconClass}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Why;
