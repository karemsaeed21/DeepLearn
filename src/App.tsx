import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';
import Step from './pages/Step';
import Articles from './pages/Articles';
import Resources from './pages/Resources';
import About from './pages/About';
import Projects from './pages/Projects';
import VideoTutorials from './pages/VideoTutorials';
import Tools from './pages/Tools';
import Datasets from './pages/Datasets';
import Community from './pages/Community';
import Glossary from './pages/Glossary';
import Contact from './pages/Contact';
import Contribute from './pages/Contribute';
import Books from './pages/books';
import SearchResults from './pages/searchresults';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="step/:nodeId" element={<Step />} />
          <Route path="articles" element={<Articles />} />
          <Route path="resources" element={<Resources />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="video-tutorials" element={<VideoTutorials />} />
          <Route path="tools" element={<Tools />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="community" element={<Community />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contribute" element={<Contribute />} />
          <Route path="books" element={<Books />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;