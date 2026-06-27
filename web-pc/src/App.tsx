 import { BrowserRouter } from 'react-router-dom';
 import AppRouter from './router';
 import MainLayout from './components/MainLayout';
 
 export default function App() {
   return (
     <BrowserRouter>
       <MainLayout>
         <AppRouter />
       </MainLayout>
     </BrowserRouter>
   );
 }
