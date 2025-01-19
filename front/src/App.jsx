import './App.css'

import Layout from './layout'
import { Route, BrowserRouter as Router, Routes } from 'react-router'
import MainPage from './components/MainPage'
import TranscribeForm from './components/TranscribeForm'
import DetailsPage from './components/DetailsPage'

function App() {

  return (
    <Layout>
    <Router>
        <Routes>
          <Route path="/transcribe" element={<TranscribeForm/>} />
          <Route path="/details/:id" element={<DetailsPage/>} />
          <Route exact path="/" element={<MainPage/>} />
        </Routes>
    </Router>
    </Layout>
  )
}

export default App
