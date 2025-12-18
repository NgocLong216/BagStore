import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout({ user }) {
  return (
    <>
      <Header user={user} />
      <Outlet />
      <Footer />
    </>
  );
}
