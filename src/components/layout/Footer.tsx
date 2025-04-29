import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">DeepLearn</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Your comprehensive guide to mastering deep learning, from fundamentals to advanced techniques.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://github.com/karemsaeed21" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://x.com/karem_saeed24" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="mailto:deeplearn314@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/roadmap" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Learning Roadmap
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/video-tutorials" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Video Tutorials
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Recommended Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tools & Frameworks
                </Link>
              </li>
              <li>
                <Link to="/datasets" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Datasets
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/glossary" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Glossary
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link to="/team" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Our Team
                </Link>
              </li> */}
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} DeepLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;