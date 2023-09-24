import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ContextProvider from './context/Context';
import Home from './pages/Home';
import Room from './pages/Room';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ContextProvider>
                <Routes>
                    <Route path='/' element={ <Home /> } />
                    <Route path='/room/:roomName' element={ <Room /> } />
                </Routes>
            </ContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
