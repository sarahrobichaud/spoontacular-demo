import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
function Layout({ children }: React.PropsWithChildren) {

    return (
        <div className="min-h-screen flex flex-col gradient-background text-white">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;