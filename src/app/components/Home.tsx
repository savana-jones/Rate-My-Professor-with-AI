//rafce
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="font-serif min-h-screen p-40">
      <div className="flex flex-col items-center justify-between">
        <div className="text-6xl text-center">Welcome to AI-Powered Professor Rating System</div>
        <div className="text-xl text-center p-8 mb-10">
          Empower your academic journey with our AI-driven platform that rates professors, tracks trends, and provides personalized recommendations.
        
        </div>
        <div className="flex space-x-4">
          <Link to="/chatbot">
              <button className="text-2xl p-4 border border-gray-800 rounded-lg hover:bg-gray-500 transition-colors">
                Ask About Professors
              </button>
          </Link>
          <Link to="/addreview">
            <button className="text-2xl p-4 border border-gray-800 rounded-lg hover:bg-gray-500 transition-colors">
            Submit Reviews
          </button>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default Home;
