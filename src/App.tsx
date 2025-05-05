// // --- React Router ---
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // --- Layout & Common Components ---
// import Layout from './components/layout/Layout';
// import FloatingChat from './components/FloatingChat';

// // --- Pages ---
// import Home from './pages/Home';
// import About from './pages/About';
// import Articles from './pages/Articles';
// import Books from './pages/books';
// import ChatPage from './pages/ChatPage';
// import Community from './pages/Community';
// import Contact from './pages/Contact';
// import Contribute from './pages/Contribute';
// import Datasets from './pages/Datasets';
// import FolderPage from './pages/FolderPage';
// import Glossary from './pages/Glossary';
// import Login from './pages/login';
// import Projects from './pages/Projects';
// import Resources from './pages/Resources';
// import Roadmap from './pages/Roadmap';
// import SearchResults from './pages/searchresults';
// import Signup from './pages/signup';
// import Step from './pages/Step';
// import Study from './pages/Study';
// import Tools from './pages/Tools';
// import VideoTutorials from './pages/VideoTutorials';




// function App() {
//   return (
//     <Router>
//       <FloatingChat userId="user123" />

//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="about" element={<About />} />
//           <Route path="articles" element={<Articles />} />
//           <Route path="books" element={<Books />} />
//           <Route path="chat" element={<ChatPage />} />
//           <Route path="community" element={<Community />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="contribute" element={<Contribute />} />
//           <Route path="datasets" element={<Datasets />} />
//           <Route path="folder/:folderId" element={<FolderPage />} />
//           <Route path="glossary" element={<Glossary />} />
//           <Route path="login" element={<Login />} />
//           <Route path="projects" element={<Projects />} />
//           <Route path="resources" element={<Resources />} />
//           <Route path="roadmap" element={<Roadmap />} />
//           <Route path="search" element={<SearchResults />} />
//           <Route path="signup" element={<Signup />} />
//           <Route path="step/:nodeId" element={<Step />} />
//           <Route path="study" element={<Study />} />
//           <Route path="tools" element={<Tools />} />
//           <Route path="video-tutorials" element={<VideoTutorials />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import FloatingQuickNote from './components/FloatingQuickNote';
import FloatingChatbot from './pages/chat/FloatingChatbot';
// Pages
import Home from './pages/Home';
import About from './pages/About';
import Articles from './pages/Articles';
import Books from './pages/books';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Contribute from './pages/Contribute';
import Datasets from './pages/Datasets';
import FolderPage from './pages/FolderPage';
import Glossary from './pages/Glossary';
import Login from './pages/login';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
import Roadmap from './pages/Roadmap';
import SearchResults from './pages/searchresults';
import Signup from './pages/signup';
import Step from './pages/Step';
import Study from './pages/Study';
import Tools from './pages/Tools';
import VideoTutorials from './pages/VideoTutorials';


function App() {
  return (
    <Router>
      <FloatingQuickNote /> {/* Add the floating button here */}
      <FloatingChatbot /> {/* Add the floating chatbot here */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="articles" element={<Articles />} />
          <Route path="books" element={<Books />} />
          <Route path="community" element={<Community />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contribute" element={<Contribute />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="folder/:folderId" element={<FolderPage />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="login" element={<Login />} />
          <Route path="projects" element={<Projects />} />
          <Route path="resources" element={<Resources />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="signup" element={<Signup />} />
          <Route path="step/:nodeId" element={<Step />} />
          <Route path="study" element={<Study />} />
          <Route path="tools" element={<Tools />} />
          <Route path="video-tutorials" element={<VideoTutorials />} />          

        </Route>
      </Routes>
    </Router>
  );
}

export default App;