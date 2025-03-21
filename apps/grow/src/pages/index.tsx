import { useRouter } from 'next/navigation';
import React from 'react';

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <header className="p-5 flex justify-between items-center bg-opacity-80 bg-black">
        <h1 className="text-3xl font-bold">Grow</h1>
        <nav className="space-x-4">
          <span className="hover:underline hover:cursor-pointer">Features</span>
          <span onClick={()=> router.push('/domainModel')} className="hover:underline hover:cursor-pointer">Domain Model</span>
          <span className="hover:underline hover:cursor-pointer">Contact</span>
        </nav>
      </header>

      <section className="text-center py-20">
        <h2 className="text-5xl font-extrabold mb-4">Empowering Skill Growth</h2>
        <p className="text-lg mb-8">Visualize and manage your learning journey with Grow.</p>
        <a href="/domainModel" className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-200">Get Started</a>
      </section>

      <section id="features" className="py-16 px-10 bg-white text-black">
        <h2 className="text-4xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-5 border rounded-lg shadow-md">
            <h3 className="font-bold text-xl">Dynamic Graph Visualizations</h3>
            <p>Explore concepts through interactive domain graphs powered by React Flow.</p>
          </div>
          <div className="p-5 border rounded-lg shadow-md">
            <h3 className="font-bold text-xl">Resource Management</h3>
            <p>Link relevant learning materials directly within the graph structure.</p>
          </div>
          <div className="p-5 border rounded-lg shadow-md">
            <h3 className="font-bold text-xl">Personalized Growth Paths</h3>
            <p>Tailor your learning path based on your skills and goals.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p>Email us at <a href="mailto:support@grow.com" className="underline">support@grow.com</a></p>
      </section>
    </div>
  );
}