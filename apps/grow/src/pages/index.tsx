import { useRouter } from 'next/navigation';
import React from 'react';
import { useAuth } from '../components/context';

export default function LandingPage() {
  const router = useRouter();
  const {user} = useAuth()
  return (
    <div className="min-h-screen pt-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <section className="text-center py-20">
        <h2 className="text-5xl font-extrabold mb-4">Empowering Skill Growth</h2>
        <p className="text-lg mb-8">Visualize and manage your learning journey with Grow.</p>
        <button onClick={()=>{
          if(user){
            router.push('/domainModel');
            return;
          }
          router.push('/auth/sign-up')}} className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-200">Get Started</button>
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