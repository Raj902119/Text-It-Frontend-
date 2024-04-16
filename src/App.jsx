import {BrowserRouter,Routes,Route} from 'react-router-dom';
import React,{Suspense, lazy, useEffect} from "react";
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Loaders from './components/Layout/Loaders.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import { server } from './constants/config.js';
import axios from "axios";
import {useSelector,useDispatch} from "react-redux";
import { userExist, userNotExist } from './redux/reducers/auth.js';

import {Toaster} from "react-hot-toast";
import { SocketProvider } from './socket.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const Home = lazy(()=>import('./pages/Home.jsx'));
const Login = lazy(()=>import('./pages/Login.jsx'));
const Chat = lazy(()=>import('./pages/Chat.jsx'));
const Group = lazy(()=>import('./pages/Group.jsx'));
const UserManagement = lazy(()=>import('./pages/admin/UserManagement.jsx'));
const ChatManagement = lazy(()=>import('./pages/admin/ChatManagement.jsx'));
const MessageManagement = lazy(()=>import('./pages/admin/MessageManagement.jsx'));

//BrowserRouter are used to enable routing 

/* Suspense is used to handle lazy loading of components and show a loading spinner 
(Loaders) while components are being loaded asynchronously. */

//Routes component is used to define the routes for the application.

//Lazy loading is used for all components using the lazy function from React.

/* Inside Routes, there are various Route components that define 
different routes in the application. Some routes are protected using the ProtectedRoute component.*/

function App() {
  const {user,loader} = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(()=>{
    axios
      .get(`${server}/api/v1/user/me`,{withCredentials: true})
      .then(({data})=> dispatch(userExist(data.user)))
      .catch((err) => dispatch(userNotExist()));
  },[])

  return loader ? (<Loaders />) : (
    <BrowserRouter>
    <Suspense fallback={<Loaders />}>
      <Routes>
        <Route 
          element={
            <SocketProvider>
              <ProtectedRoute user={user} redirect={"/login"}/>
            </SocketProvider>
            }
          >
          <Route path='/' element={<Home />}></Route>
          <Route path='chat/:id' element={<Chat />}></Route>
          <Route path='/group' element={<Group />}></Route>
        </Route>
        <Route path='/login' element={<ProtectedRoute user={!user} redirect="/"><Login /></ProtectedRoute>}></Route>
        <Route path='/admin' element={<AdminLogin />}></Route>
        <Route path='/admin/dashboard' element={<Dashboard />}></Route>
        <Route path='/admin/users-management' element={<UserManagement />}></Route>
        <Route path='/admin/chats-management' element={<ChatManagement />}></Route>
        <Route path='/admin/messages' element={<MessageManagement />}></Route>
        <Route path='*' element={<NotFoundPage />}></Route>
      </Routes>
    </Suspense>
    <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App
