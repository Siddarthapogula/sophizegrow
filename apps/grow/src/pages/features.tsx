import Footer from "../components/Footer";

export default function Features() {
  return (
    <div>
      <section id="features" className="py-16 px-10 bg-white text-black">
        <h2 className="text-4xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-5 border rounded-lg shadow-md">
            <h3 className="font-bold text-xl">Dynamic Graph Visualizations</h3>
            <p>
              Explore concepts through interactive domain graphs powered by
              React Flow.
            </p>
          </div>
          <div className="p-5 border rounded-lg shadow-md">
            <h3 className="font-bold text-xl">Resource Management</h3>
            <p>
              Link relevant learning materials directly within the graph
              structure.
            </p>
          </div>
          <div className="p-5 border rounded-lg shadow-md">
            <h3 className="font-bold text-xl">Personalized Growth Paths</h3>
            <p>Tailor your learning path based on your skills and goals.</p>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
