"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';

const PentagonPage = () => {
    const [activeCollection, setActiveCollection] = useState('reserve');

    const collections = {
        reserve: [
            {
                id: 1,
                name: "Pentagon Classic Red",
                price: 199.99,
                image: "/images/pentagon-reserve.jpg",
                description: "Our flagship blend with five distinct grape varieties",
                year: 2018,
                grapes: ["Cabernet Sauvignon", "Merlot", "Syrah", "Malbec", "Petit Verdot"],
                aging: "24 months in French oak"
            },
            {
                id: 2,
                name: "Pentagon Blanc",
                price: 179.99,
                image: "/images/pentagon-blanc.jpg",
                description: "White blend from five historic vineyards",
                year: 2020,
                grapes: ["Chardonnay", "Sauvignon Blanc", "Viognier", "Roussanne", "Marsanne"],
                aging: "12 months in neutral oak"
            }
        ],
        limited: [
            {
                id: 3,
                name: "Black Pentagon",
                price: 349.99,
                image: "/images/pentagon-black.jpg",
                description: "Aged in black oak barrels for 5 years",
                year: 2016,
                grapes: ["Cabernet Sauvignon", "Tannat", "Petit Verdot", "Alicante Bouschet", "Sagrantino"],
                aging: "60 months in black oak"
            },
            {
                id: 4,
                name: "Golden Pentagon",
                price: 299.99,
                image: "/images/pentagon-gold.jpg",
                description: "Rare golden-hued blend",
                year: 2019,
                grapes: ["Sémillon", "Chenin Blanc", "Roussanne", "Viognier", "Chardonnay"],
                aging: "18 months in acacia wood"
            }
        ]
    };

    const wineCharacteristics = [
        {
            title: "Five Elements",
            icon: "🜛",
            content: "Each blend combines five grape varieties for perfect harmony"
        },
        {
            title: "Aging Process",
            icon: "⏳",
            content: "Precisely timed aging in pentagonal barrels"
        },
        {
            title: "Terroir Focus",
            icon: "🗺️",
            content: "Grapes sourced from five distinct microclimates"
        },
        {
            title: "Geometric Balance",
            icon: "⬟",
            content: "Flavor profiles designed with mathematical precision"
        }
    ];

    const pairingGuide = [
        {
            wine: "Pentagon Reserve",
            pairings: ["Dry-aged ribeye", "Wild mushroom risotto", "Aged gouda"]
        },
        {
            wine: "Black Pentagon",
            pairings: ["Venison", "Dark chocolate", "Blue cheese"]
        },
        {
            wine: "Pentagon Blanc",
            pairings: ["Scallops", "Goat cheese", "Lemon tart"]
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#f8f5ee] text-[#1a1a1a]">
                {/* Navigation Anchor */}
                <div id="top"></div>

                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center bg-[#1a1a1a] text-[#d4b26a]">
                    <div className="absolute inset-0 overflow-hidden">
                        <Image
                            src="/images/pentagon-hero.jpg"
                            alt="Pentagon wine bottles"
                            fill
                            className="object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-[#1a1a1a]/70"></div>
                    </div>
                    <div className="relative z-10 text-center px-4 max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-crimson-text mb-6 tracking-wider">PENTAGON</h1>
                        <div className="w-20 h-1 bg-[#d4b26a] mx-auto mb-8"></div>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                            Five elements. One extraordinary wine.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="#collections" className="bg-[#d4b26a] text-[#1a1a1a] px-8 py-3 rounded-full hover:bg-[#c4a25a] transition duration-300 font-medium">
                                Explore Collections
                            </Link>
                            <Link href="#philosophy" className="border border-[#d4b26a] px-8 py-3 rounded-full hover:bg-[#d4b26a] hover:text-[#1a1a1a] transition duration-300">
                                Our Philosophy
                            </Link>
                        </div>
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <Link href="#collections" className="animate-bounce">
                            <svg className="w-6 h-6 text-[#d4b26a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </Link>
                    </div>
                </section>

                {/* Collections */}
                <section id="collections" className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-crimson-text mb-4">The Pentagon Collections</h2>
                            <div className="flex justify-center mb-8">
                                <div className="inline-flex rounded-full p-1 bg-[#f8f5ee]">
                                    <button
                                        onClick={() => setActiveCollection('reserve')}
                                        className={`px-6 py-2 rounded-full transition ${activeCollection === 'reserve' ? 'bg-[#1a1a1a] text-[#d4b26a]' : 'hover:bg-[#e8e5de]'}`}
                                    >
                                        Reserve Series
                                    </button>
                                    <button
                                        onClick={() => setActiveCollection('limited')}
                                        className={`px-6 py-2 rounded-full transition ${activeCollection === 'limited' ? 'bg-[#1a1a1a] text-[#d4b26a]' : 'hover:bg-[#e8e5de]'}`}
                                    >
                                        Limited Editions
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {collections[activeCollection].map((wine) => (
                                <div key={wine.id} className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/2 h-96 relative bg-[#f8f5ee] rounded-lg overflow-hidden shadow-lg">
                                        <Image
                                            src={wine.image}
                                            alt={wine.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a]/80 text-white p-4">
                                            <span className="text-sm">Vintage {wine.year}</span>
                                        </div>
                                    </div>
                                    <div className="md:w-1/2">
                                        <h3 className="text-2xl font-crimson-text mb-2">{wine.name}</h3>
                                        <p className="text-gray-600 mb-6">{wine.description}</p>

                                        <div className="mb-6">
                                            <h4 className="font-medium mb-2">Grape Varieties:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {wine.grapes.map((grape, i) => (
                                                    <span key={i} className="px-3 py-1 bg-[#f8f5ee] rounded-full text-sm">
                                                        {grape}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <p className="text-sm text-gray-500">Vintage</p>
                                                <p className="text-lg">{wine.year}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Aging</p>
                                                <p className="text-lg">{wine.aging}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-medium">R{wine.price}</span>
                                            <button className="bg-[#1a1a1a] text-[#d4b26a] px-6 py-2 rounded-full hover:bg-black transition">
                                                Add to Collection
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Wine Philosophy */}
                <section id="philosophy" className="py-20 bg-[#1a1a1a] text-[#d4b26a]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-crimson-text mb-4">The Pentagon Philosophy</h2>
                            <div className="w-20 h-1 bg-[#d4b26a] mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {wineCharacteristics.map((item, index) => (
                                <div key={index} className="bg-[#2a2a2a] p-6 rounded-lg text-center">
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-crimson-text mb-3">{item.title}</h3>
                                    <p className="text-[#d4b26a]/80">{item.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/2 p-8">
                                    <h3 className="text-2xl font-crimson-text mb-4">Geometric Perfection</h3>
                                    <p className="text-[#d4b26a]/80 mb-6">
                                        Pentagon wines are crafted using the golden ratio, with each element carefully measured to achieve perfect balance. Our pentagonal barrels create unique micro-oxygenation that enhances complexity.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-[#d4b26a] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Five grape varieties in each blend</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-[#d4b26a] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Five years minimum aging for reserve wines</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-[#d4b26a] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Five-step quality assurance process</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="md:w-1/2 h-64 md:h-auto relative">
                                    <Image
                                        src="/images/pentagon-barrels.jpg"
                                        alt="Pentagonal wine barrels"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pairing Guide */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-crimson-text mb-4">Perfect Pairings</h2>
                            <p className="max-w-2xl mx-auto text-gray-600">
                                Culinary combinations to elevate your Pentagon experience
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {pairingGuide.map((pairing, index) => (
                                <div key={index} className="border border-[#e8e5de] rounded-lg overflow-hidden hover:shadow-lg transition">
                                    <div className="h-48 bg-[#f8f5ee] flex items-center justify-center">
                                        <span className="text-xl font-crimson-text">{pairing.wine}</span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium mb-4">Recommended Pairings:</h3>
                                        <ul className="space-y-2">
                                            {pairing.pairings.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <svg className="w-4 h-4 text-[#d4b26a] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="max-w-3xl mx-auto bg-[#f8f5ee] p-8 rounded-lg">
                            <h3 className="text-2xl font-crimson-text mb-4">The Pentagon Tasting Ritual</h3>
                            <ol className="space-y-4 list-decimal list-inside">
                                <li className="font-medium">Visual Examination</li>
                                <p className="text-gray-600 ml-6 -mt-4 mb-2">Observe the wine's color and viscosity against white light</p>

                                <li className="font-medium">First Aroma</li>
                                <p className="text-gray-600 ml-6 -mt-4 mb-2">Swirl gently and identify primary aromas</p>

                                <li className="font-medium">Second Aroma</li>
                                <p className="text-gray-600 ml-6 -mt-4 mb-2">After 5 minutes, detect evolving secondary notes</p>

                                <li className="font-medium">Palate Analysis</li>
                                <p className="text-gray-600 ml-6 -mt-4 mb-2">Assess the balance of all five flavor components</p>

                                <li className="font-medium">Finish Evaluation</li>
                                <p className="text-gray-600 ml-6 -mt-4">Measure the duration and complexity of the aftertaste</p>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* Vineyard */}
                <section className="py-20 bg-[#f8f5ee]">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                                <div className="h-96 relative rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src="/images/pentagon-vineyard.jpg"
                                        alt="Pentagon vineyard"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-crimson-text mb-6">Our Vineyards</h2>
                                <p className="text-gray-700 mb-6">
                                    Pentagon wines source grapes from five distinct microclimates across three continents. Each vineyard is selected for its unique terroir characteristics that contribute one essential element to our blends.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Vineyard Locations</p>
                                        <p className="text-lg">5 Countries</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Vine Age</p>
                                        <p className="text-lg">25-45 Years</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Harvest Method</p>
                                        <p className="text-lg">Hand Picked</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Sustainability</p>
                                        <p className="text-lg">Organic Certified</p>
                                    </div>
                                </div>
                                <Link href="/experiences" className="inline-block border border-[#1a1a1a] px-6 py-3 rounded-full hover:bg-[#1a1a1a] hover:text-[#d4b26a] transition">
                                    Book a Vineyard Tour
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-[#1a1a1a] text-[#d4b26a]">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-crimson-text mb-6">Experience Geometric Perfection</h2>
                        <p className="max-w-2xl mx-auto text-[#d4b26a]/80 mb-8">
                            Join our collector's circle for exclusive access to limited releases
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="#collections" className="bg-[#d4b26a] text-[#1a1a1a] px-8 py-3 rounded-full hover:bg-[#c4a25a] transition font-medium">
                                Join the Club
                            </Link>
                            <Link href="#top" className="border border-[#d4b26a] px-8 py-3 rounded-full hover:bg-[#d4b26a] hover:text-[#1a1a1a] transition">
                                Back to Top
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default PentagonPage;