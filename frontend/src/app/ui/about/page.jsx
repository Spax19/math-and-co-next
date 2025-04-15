"use client";
import React from "react";
import Navbar from "../../../components/navbar";

function MainComponent() {
  const teamMembers = [
    {
      name: "Isabella Rodriguez",
      role: "Master Winemaker",
      image: "/images/winemaker.jpg",
      bio: "With over 20 years of experience, Isabella brings passion and expertise to every bottle we produce.",
    },
    {
      name: "Marcus Chen",
      role: "Vineyard Manager",
      image: "/images/vineyard-manager.jpg",
      bio: "Marcus ensures our vines receive the perfect care throughout the growing season.",
    },
    {
      name: "Sophie Laurent",
      role: "Sommelier",
      image: "/images/sommelier.jpg",
      bio: "Our resident wine expert who curates our exceptional wine collection.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="relative h-[60vh]">
          <img
            src="/images/vineyard-hero.jpg"
            alt="Scenic view of our vineyard at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl text-white font-crimson-text text-center">
              Our Story
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <section className="mb-20">
            <h2 className="text-3xl font-crimson-text mb-6">Our Heritage</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  Founded in 1925, our family-owned vineyard has been crafting
                  exceptional wines for three generations. Nestled in the heart of
                  wine country, our estate combines time-honored traditions with
                  modern innovation.
                </p>
                <p className="text-gray-700">
                  What started as a modest 10-acre vineyard has grown into a
                  200-acre estate, while maintaining our commitment to sustainable
                  farming and exceptional quality.
                </p>
              </div>
              <img
                src="/images/old-cellar.jpg"
                alt="Historic wine cellar from 1925"
                className="rounded-lg"
              />
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-crimson-text mb-6">
              The Art of Winemaking
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4">
                  <i className="fas fa-seedling text-4xl text-[#d4b26a]"></i>
                </div>
                <h3 className="font-crimson-text text-xl mb-2">The Vineyard</h3>
                <p className="text-gray-700">
                  Our grapes are carefully tended throughout the year, ensuring
                  optimal ripeness at harvest.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4">
                  <i className="fas fa-wine-glass text-4xl text-[#d4b26a]"></i>
                </div>
                <h3 className="font-crimson-text text-xl mb-2">Fermentation</h3>
                <p className="text-gray-700">
                  We use both traditional and modern techniques to bring out the
                  best in our grapes.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4">
                  <i className="fas fa-wine-bottle text-4xl text-[#d4b26a]"></i>
                </div>
                <h3 className="font-crimson-text text-xl mb-2">Aging</h3>
                <p className="text-gray-700">
                  Our wines mature in French oak barrels in our
                  temperature-controlled cellars.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-crimson-text mb-10">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-crimson-text text-xl mb-2">
                    {member.name}
                  </h3>
                  <h4 className="text-[#d4b26a] mb-2">{member.role}</h4>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-crimson-text mb-6">Our Facilities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <img
                src="/images/winery-exterior.jpg"
                alt="Modern winery building exterior"
                className="rounded-lg"
              />
              <img
                src="/images/barrel-room.jpg"
                alt="Oak barrel aging room"
                className="rounded-lg"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default MainComponent;