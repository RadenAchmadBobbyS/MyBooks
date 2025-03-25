import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './pages/login'

function App() {

  

  return (
    <>
    <BrowserRouter>
    <Routes>

    <Route path='/' element={<h1>home</h1>}/>
    <Route path='/login' element={<Login />}/>  
      
    </Routes>    
    </BrowserRouter>
    </>
  )
}

export default App
