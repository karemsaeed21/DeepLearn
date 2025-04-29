import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Brain, Layers, Lightbulb, Map } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-900 text-white pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mt-10 lg:mt-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Journey into <span className="text-teal-400">Deep Learning</span> Starts Here
              </h1>
              <p className="mt-6 text-lg md:text-xl text-indigo-100 max-w-xl">
                From zero to hero: A structured, guided path to mastering deep learning concepts, with curated resources at every step.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="whitespace-nowrap"
                >
                  <Link to="/roadmap" className="flex items-center">
                    Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <Link to="/resources" className="flex items-center">
                    Explore Resources <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Deep Learning Visualization" 
                className="rounded-lg shadow-2xl max-w-md w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Learn With Us?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our structured approach helps you navigate the complex world of deep learning with confidence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Map className="h-8 w-8 text-indigo-600" />,
                title: 'Structured Learning Path',
                description: 'Follow a carefully crafted roadmap that guides you from fundamentals to advanced concepts.',
              },
              {
                icon: <Lightbulb className="h-8 w-8 text-indigo-600" />,
                title: 'Learning Prioritization',
                description: 'Clear indicators for essential vs. optional content help you focus on what matters most.',
              },
              {
                icon: <Layers className="h-8 w-8 text-indigo-600" />,
                title: 'Curated Resources',
                description: 'Each topic includes hand-picked articles, videos, and books from trusted sources.',
              },
              {
                icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
                title: 'In-depth Articles',
                description: 'Original content and embedded Medium articles explain complex topics clearly.',
              },
              {
                icon: <Brain className="h-8 w-8 text-indigo-600" />,
                title: 'Visualized Concepts',
                description: 'Interactive visualizations help you understand neural networks and algorithms intuitively.',
              },
              {
                icon: <Award className="h-8 w-8 text-indigo-600" />,
                title: 'Progress Tracking',
                description: 'Track your learning journey and see your progress visually on the roadmap.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-indigo-100 p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How to Get Started</h2>
              <p className="mt-4 text-xl text-gray-600">
                Your journey to deep learning mastery is just a few steps away.
              </p>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Explore the Roadmap',
                  description: 'Browse our interactive learning path to get a big-picture view of your journey.',
                  action: 'View Roadmap',
                  link: '/roadmap',
                },
                {
                  step: '02',
                  title: 'Start with Fundamentals',
                  description: 'Begin with the essential mathematical concepts that form the foundation of deep learning.',
                  action: 'Learn Fundamentals',
                  link: '/step/basics',
                },
                {
                  step: '03',
                  title: 'Work Through Each Topic',
                  description: 'Progress through the roadmap, completing each topic before moving to dependent concepts.',
                  action: 'See Topics',
                  link: '/roadmap',
                },
                {
                  step: '04',
                  title: 'Apply Your Knowledge',
                  description: 'Reinforce your learning with practical projects and exercises included in each topic.',
                  action: 'View Projects',
                  link: '/projects',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start p-6 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-12 h-12 bg-indigo-700 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Link
                      to={item.link}
                      className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      {item.action} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="primary" size="lg">
                <Link to="/roadmap">Begin Your Journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">From Our Community</h2>
            <p className="mt-4 text-xl text-indigo-200 max-w-3xl mx-auto">
              Hear from fellow learners who transformed their understanding of deep learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "This structured approach to learning deep learning finally helped me understand the big picture and how everything connects.",
                name: "Michael Chen",
                title: "Software Developer"
              },
              {
                quote: "The roadmap made it clear which concepts I needed to master first. The curated resources saved me countless hours of searching.",
                name: "Sarah Johnson",
                title: "Data Scientist"
              },
              {
                quote: "As someone with little math background, the beginner-friendly explanations made complex concepts approachable and engaging.",
                name: "Raj Patel",
                title: "AI Enthusiast"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-indigo-800 p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-indigo-300">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-indigo-100 mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-indigo-300 text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-10 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Master Deep Learning?</h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are building their deep learning expertise with our structured roadmap.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Link to="/roadmap" className="flex items-center">
                  Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;