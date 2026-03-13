import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-grow bg-gray-50/30 min-h-[calc(100vh-80px)]">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
