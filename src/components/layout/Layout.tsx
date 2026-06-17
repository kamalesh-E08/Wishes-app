import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import Footer from "./Footer";
import GlowBackground from "../ui/GlowBackground";

const Layout = () => {
  return (
    <>
      <GlowBackground />

      <Navbar />

      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
