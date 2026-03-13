import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ allowedRoles }) => {
    const { userInfo } = useSelector((state) => state.auth);

    return userInfo && allowedRoles.includes(userInfo.role) ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
};

export default RoleRoute;
