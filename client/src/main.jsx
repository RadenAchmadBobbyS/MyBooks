import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login'
import MainLayout from './components/Main.layout'
import HomePage from './pages/Home.page'
import { Provider as ReduxProvider } from 'react-redux'
import store from './store'
import BookDetail from './pages/BookDetail'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Checkout from './components/Checkout'

createRoot(document.getElementById('root')).render(
  <ReduxProvider store={store}>
  <BrowserRouter>
  <Routes>

  <Route path='/login' element={<Login />}/>  

  <Route element={<MainLayout />}>
  <Route path='/' element={<HomePage />}/>
  <Route path='/books/:id' element={<BookDetail />}/>
  <Route path='/profile' element={<Profile />}/>
  <Route path='/favorites' element={<Favorites />}/>
  </Route>

  <Route path='/admin' element={<AdminPanel />}/>
  
  </Routes>    
  </BrowserRouter>
  </ReduxProvider>
)
