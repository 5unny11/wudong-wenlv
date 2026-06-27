 import axios from 'axios';
 
 const api = axios.create({
   baseURL: '/api',
   timeout: 10000,
 });
 
 // 自动附加 Token
 api.interceptors.request.use((config) => {
   const token = sessionStorage.getItem('token');
   if (token) config.headers.Authorization = `Bearer ${token}`;
   return config;
 });
 
 // 统一错误处理
 api.interceptors.response.use(
   (res) => res,
   (err) => {
     if (err.response?.status === 401) {
       sessionStorage.removeItem('token');
       sessionStorage.removeItem('user');
       window.location.href = '/login';
     }
     return Promise.reject(err);
   },
 );
 
 export default api;
 
 // ====== API 方法 ======
 export const authAPI = {
   register: (phone: string, password: string) =>
     api.post('/auth/register', { phone, password }).then(r => r.data),
   login: (phone: string, password: string) =>
     api.post('/auth/login', { phone, password }).then(r => r.data),
 };
 
 export const productAPI = {};
 export const orderAPI = {};
export const travelAPI = {
  listScenicSpots: (keyword?: string) =>
    api.get('/scenic-spots', { params: { keyword } }).then(r => r.data),
  getScenicSpot: (id: number) =>
    api.get(`/scenic-spots/${id}`).then(r => r.data),
  getTicketTypes: (scenicSpotId: number) =>
    api.get(`/scenic-spots/${scenicSpotId}/tickets`).then(r => r.data),

  listRoutes: (duration?: string) =>
    api.get('/routes', { params: { duration } }).then(r => r.data),
  getRoute: (id: number) =>
    api.get(`/routes/${id}`).then(r => r.data),
  getRouteSchedules: (routeId: number) =>
    api.get(`/routes/${routeId}/schedules`).then(r => r.data),

  listTransportGuides: (departure?: string, destination?: string) =>
    api.get('/transport-guides', { params: { departure, destination } }).then(r => r.data),
  getTransportGuide: (id: number) =>
    api.get(`/transport-guides/${id}`).then(r => r.data),

  createTravelOrder: (data: any) =>
    api.post('/travel/orders', data).then(r => r.data),
  listMyTravelOrders: (status?: number) =>
    api.get('/travel/orders', { params: { status } }).then(r => r.data),
  getTravelOrderDetail: (id: number) =>
    api.get(`/travel/orders/${id}`).then(r => r.data),
  cancelTravelOrder: (id: number) =>
    api.post(`/travel/orders/${id}/cancel`).then(r => r.data),
  payTravelOrder: (id: number) =>
    api.post(`/travel/orders/${id}/pay`).then(r => r.data),

  listMyETickets: (status?: number) =>
    api.get('/e-tickets', { params: { status } }).then(r => r.data),
  getETicket: (id: number) =>
    api.get(`/e-tickets/${id}`).then(r => r.data),
  verifyETicket: (qrCode: string) =>
    api.post('/admin/travel/e-tickets/verify', { qrCode }).then(r => r.data),

  createReview: (data: any) =>
    api.post('/travel/reviews', data).then(r => r.data),
  listReviews: (targetType: string, targetId: number) =>
    api.get('/travel/reviews', { params: { targetType, targetId } }).then(r => r.data),
};
