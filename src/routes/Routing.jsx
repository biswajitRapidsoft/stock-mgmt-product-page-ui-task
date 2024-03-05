import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import StockList from "../components/StockList";
import AddProduct from "../components/AddProduct";

const Routing = () => {
  return (
    <>
      <Routes>
        <Route path="/stocklist" element={<StockList />} />
        <Route path="/addproduct" element={<AddProduct />} />
      </Routes>
    </>
  );
};

export default Routing;
