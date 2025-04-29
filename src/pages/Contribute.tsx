import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Code, Edit, BookOpen, MessageSquare } from 'lucide-react';

const Contribute: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contribute to DeepLearn
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us make deep learning education more accessible by contributing your expertise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: Edit,
              title: 'Write Articles',
              description: 'Share your knowledge by writing articles on deep learning topics.',
              action: 'Submit Article'
            },
            {
              icon: Code,
              title: 'Create Projects',
              description: 'Design hands-on projects to help others learn through practice.',
              action: 'Submit Project'
            },
            {
              icon: BookOpen,
              title: 'Review Content',
              description: 'Help maintain quality by reviewing submitted content.',
              action: 'Become Reviewer'
            },
            {
              icon: MessageSquare,
              title: 'Community Support',
              description: 'Help other learners by answering questions in our community.',
              action: 'Join Community'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hoverable className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <item.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">{item.description}</p>
                <Button variant="outline" className="w-full">
                  {item.action}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contribution Guidelines */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contribution Guidelines
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Content Quality Standards
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Clear and concise explanations</li>
                <li>Practical examples and code snippets</li>
                <li>Proper citations and references</li>
                <li>Original content only</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Submission Process
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Submit draft for review</li>
                <li>Receive feedback from reviewers</li>
                <li>Make necessary revisions</li>
                <li>Final approval and publication</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join our community of contributors and help shape the future of deep learning education.
          </p>
            <Button
            variant="secondary"
            size="lg"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
            Get Started
            </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Contribute;