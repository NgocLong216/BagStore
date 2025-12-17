import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children, user }) {
  return (
    <>
      <Header user={user} />
      {children}
      <Footer />
    </>
  );
}
