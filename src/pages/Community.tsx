import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Users, MessageSquare, Calendar, Award } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow learners, share your progress, and get help from experienced practitioners.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: Users,
              title: 'Study Groups',
              description: 'Join or create study groups to learn together and stay motivated.',
            },
            {
              icon: MessageSquare,
              title: 'Discussion Forums',
              description: 'Ask questions, share insights, and participate in deep learning discussions.',
            },
            {
              icon: Calendar,
              title: 'Events',
              description: 'Attend virtual meetups, workshops, and expert talks.',
            },
            {
              icon: Award,
              title: 'Challenges',
              description: 'Participate in monthly coding challenges and competitions.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Introduction to Transformers',
                date: 'October 15, 2025',
                time: '2:00 PM EST',
                speaker: 'Dr. Sarah Chen',
                type: 'Workshop',
              },
              {
                title: 'Deep Learning Project Showcase',
                date: 'October 20, 2025',
                time: '3:00 PM EST',
                speaker: 'Community Members',
                type: 'Showcase',
              },
              {
                title: 'Neural Networks Study Group',
                date: 'October 25, 2025',
                time: '1:00 PM EST',
                speaker: 'Michael Johnson',
                type: 'Study Group',
              },
            ].map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-gray-600">
                        {event.speaker} • {event.date} • {event.time}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Register
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
            Become part of our growing community of deep learning enthusiasts and accelerate your learning journey.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Join Community
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;