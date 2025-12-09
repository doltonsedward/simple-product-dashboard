import { Tabs, Tab } from "@heroui/react";
import ProductsSection from "./components/ProductsSection.tsx";
import StocksSection from "./components/StocksSection.tsx";
import OrdersSection from "./components/OrdersSection.tsx";

function App() {
  return (
    <div className="dark min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Admin Furniture Modern
        </h1>
        <Tabs aria-label="Admin Sections" color="primary" variant="solid">
          <Tab key="products" title="Products">
            <ProductsSection />
          </Tab>
          <Tab key="stocks" title="Stocks">
            <StocksSection />
          </Tab>
          <Tab key="orders" title="Orders">
            <OrdersSection />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
