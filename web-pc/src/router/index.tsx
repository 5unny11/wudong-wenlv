import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/user/Login';
import RegisterPage from '@/pages/user/Register';
import ProfilePage from '@/pages/user/Profile';
import TravelPage from '@/pages/travel/Travel';
import ScenicSpotDetailPage from '@/pages/travel/ScenicSpotDetail';
import RouteDetailPage from '@/pages/travel/RouteDetail';
import TransportGuideDetailPage from '@/pages/travel/TransportGuideDetail';
import ETicketDetailPage from '@/pages/travel/ETicketDetail';
import TravelOrdersPage from '@/pages/travel/TravelOrders';
import TravelOrderDetailPage from '@/pages/travel/OrderDetail';
import AdminTravelPage from '@/pages/admin/travel';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/travel" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/travel" element={<TravelPage />} />
      <Route path="/travel/scenic-spots/:id" element={<ScenicSpotDetailPage />} />
      <Route path="/travel/routes/:id" element={<RouteDetailPage />} />
      <Route path="/travel/transport-guides/:id" element={<TransportGuideDetailPage />} />
      <Route path="/travel/e-tickets/:id" element={<ETicketDetailPage />} />
      <Route path="/travel/orders" element={<TravelOrdersPage />} />
      <Route path="/travel/orders/:id" element={<TravelOrderDetailPage />} />
      <Route path="/admin/travel" element={<AdminTravelPage />} />
    </Routes>
  );
}
