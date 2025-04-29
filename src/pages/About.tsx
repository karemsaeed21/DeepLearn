import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const team = [
  {
    name: 'Kareem Mohamed',
    role: 'Computer Science Student',
    bio: 'Passionate about deep learning and its applications in real-world problems.',
    image: './src/images/kareem.JPG',
    social: {
      twitter: 'https://x.com/karem_saeed24',
      linkedin: 'https://www.linkedin.com/in/kareem-mohamed-4ac',
      github: 'https://github.com/karemsaeed21'
    }
  },
  {
    name: 'Abdelrahman Mohamed',
    role: 'Computer Science Student',
    bio: 'Enthusiast in machine learning and data science, focusing on practical applications.',
    image: './src/images/bedo.jpg',
    social: {
      twitter: 'https://x.com/ar_exe_',
      linkedin: 'https://www.linkedin.com/in/abdulrahman-khalil-742453252/',
      github: 'https://github.com/ar-exe'
    }
  },
  {
    name: 'Abdallah Sharf',
    role: 'Computer Science Student',
    bio: 'Aspiring data scientist with a keen interest in deep learning technologies.',
    image: './src/images/abdallah.jpg',
    social: {
      twitter: 'https://x.com/mmacode50',
      linkedin: 'https://www.linkedin.com/in/abdallah-sharf/',
      github: 'https://github.com/AbdallahSharf'
    }
  }
];

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Mission Section */}
        <section className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Our Mission
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We're dedicated to making deep learning accessible to everyone through
            structured, comprehensive education that bridges theory and practice.
          </motion.p>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex space-x-4">
                    <a
                      href={member.social.twitter}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social.github}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-indigo-900 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-indigo-200 mb-8">
              Have questions about our program or want to contribute? We'd love to hear from you.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="mailto:deeplearn314@gmail.com"
                className="flex items-center text-white hover:text-indigo-200 transition-colors"
              >
                <Mail className="h-6 w-6 mr-2" />
                <span>Email Us</span>
              </a>
              <a
                href="https://x.com/karem_saeed24"
                className="flex items-center text-white hover:text-indigo-200 transition-colors"
              >
                <Twitter className="h-6 w-6 mr-2" />
                <span>Follow Us</span>
              </a>
              <a
                href="#"
                className="flex items-center text-white hover:text-indigo-200 transition-colors"
              >
                <Github className="h-6 w-6 mr-2" />
                <span>Contribute</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;