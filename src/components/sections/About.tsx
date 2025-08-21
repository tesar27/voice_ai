"use client";

import { useState } from "react";
import { Code, Brain, Zap, Users } from "lucide-react";

export default function About() {
  const [activeTab, setActiveTab] = useState("experience");

  const skills = [
    "AI/ML Development",
    "Voice AI Integration",
    "Next.js & React",
    "Python & Node.js",
    "Natural Language Processing",
    "API Development",
    "Cloud Architecture",
    "Process Automation",
  ];

  const experience = [
    {
      year: "2024",
      title: "Senior AI Engineer",
      company: "Tech Innovation Corp",
      description:
        "Leading development of enterprise AI agents and voice automation solutions",
    },
    {
      year: "2022-2024",
      title: "Full Stack Developer",
      company: "Digital Solutions Inc",
      description:
        "Built scalable web applications and integrated AI/ML capabilities",
    },
    {
      year: "2021-2022",
      title: "Software Engineer",
      company: "StartupTech",
      description:
        "Developed mobile and web applications with focus on user experience",
    },
  ];

  const stats = [
    { icon: Code, label: "Projects Completed", value: "50+" },
    { icon: Brain, label: "AI Models Deployed", value: "25+" },
    { icon: Zap, label: "APIs Integrated", value: "100+" },
    { icon: Users, label: "Clients Served", value: "30+" },
  ];

  return (
    <section id="about" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              I'm a passionate AI engineer specializing in creating intelligent
              solutions that bridge the gap between human interaction and
              artificial intelligence.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => setActiveTab("experience")}
                    className={`px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "experience"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Experience
                  </button>
                  <button
                    onClick={() => setActiveTab("skills")}
                    className={`px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "skills"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Skills & Expertise
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="md:w-2/3">
              {activeTab === "experience" && (
                <div className="space-y-8">
                  {experience.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <span className="text-blue-400 font-medium">
                          {item.year}
                        </span>
                      </div>
                      <h4 className="text-gray-400 mb-3">{item.company}</h4>
                      <p className="text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "skills" && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-6">
                    Technical Expertise
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-200">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
