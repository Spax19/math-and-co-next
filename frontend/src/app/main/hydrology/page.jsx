"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
const HydrologyPage = () => {
    const [activeTab, setActiveTab] = useState('still');

    const products = {
        still: [
            {
                id: 1,
                name: "Mineral Spring Still",
                price: 24.99,
                image: "/images/hydrology.jpg",
                description: "Naturally filtered through volcanic rock",
                minerals: ["Calcium", "Magnesium", "Silica"],
                tds: 220,
                ph: 7.4
            },
            {
                id: 2,
                name: "Alpine Glacier Still",
                price: 29.99,
                image: "/images/hydrology.jpg",
                description: "Sourced from untouched mountain glaciers",
                minerals: ["Potassium", "Bicarbonates"],
                tds: 85,
                ph: 7.8
            }
        ],
        sparkling: [
            {
                id: 3,
                name: "Black Silica Sparkling",
                price: 34.99,
                image: "/images/hydrology.jpg",
                description: "Infused with rare black silica minerals",
                minerals: ["Silica", "Iron", "Bicarbonates"],
                tds: 310,
                ph: 6.9
            },
            {
                id: 4,
                name: "Effervescent Spring",
                price: 39.99,
                image: "/images/hydrology.jpg",
                description: "Naturally carbonated at source",
                minerals: ["Calcium", "Magnesium", "Sodium"],
                tds: 180,
                ph: 6.2
            }
        ]
    };

    const waterFacts = [
        {
            title: "Mineral Composition",
            content: "The unique blend of minerals in each Hydrology water contributes to its distinct taste and health benefits."
        },
        {
            title: "Total Dissolved Solids (TDS)",
            content: "TDS measures the mineral content in water. Hydrology waters range from 85-310 mg/L for different experiences."
        },
        {
            title: "pH Balance",
            content: "Our waters maintain a natural pH between 6.2-7.8, perfect for daily hydration."
        },
        {
            title: "Source Protection",
            content: "Each Hydrology source is protected with a 10km radius conservation zone."
        }
    ];

    const hydrationGuide = [
        { time: "Morning", amount: "500ml", tip: "Start your day with Mineral Spring to activate digestion" },
        { time: "Midday", amount: "750ml", tip: "Alpine Glacier helps maintain focus and energy" },
        { time: "Evening", amount: "500ml", tip: "Black Silica aids in relaxation and recovery" }
    ];

    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            <Navbar cart={cart} setIsCartOpen={setIsCartOpen} />
            <div className="min-h-screen bg-gray-50 text-gray-900">
                {/* Navigation Anchor */}
                <div id="top"></div>

                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center bg-black text-white">
                    <div className="absolute inset-0 overflow-hidden">
                        <Image
                            src="/images/hydrology-hero.jpeg"
                            alt="Hydrology water droplets"
                            fill
                            className="object-cover opacity-30"
                        />
                    </div>
                    <div className="relative z-10 text-center px-4 max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-wider">HYDROLOGY</h1>
                        <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto">
                            The science of perfect water. Still and sparkling varieties sourced from Earth's purest aquifers.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="#products" className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition duration-300">
                                Explore Waters
                            </Link>
                            <Link href="#science" className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition duration-300">
                                The Science
                            </Link>
                        </div>
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <Link href="#products" className="animate-bounce">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </Link>
                    </div>
                </section>

                {/* Product Range */}
                <section id="products" className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-light mb-4">Our Water Collection</h2>
                            <div className="flex justify-center mb-8">
                                <div className="inline-flex rounded-full p-1 bg-gray-100">
                                    <button
                                        onClick={() => setActiveTab('still')}
                                        className={`px-6 py-2 rounded-full transition ${activeTab === 'still' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                                    >
                                        Still Waters
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('sparkling')}
                                        className={`px-6 py-2 rounded-full transition ${activeTab === 'sparkling' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                                    >
                                        Sparkling Waters
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {products[activeTab].map((product) => (
                                <div key={product.id} className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <h3 className="text-2xl font-light mb-2">{product.name}</h3>
                                        <p className="text-gray-600 mb-4">{product.description}</p>
                                        <div className="mb-6">
                                            <h4 className="font-medium mb-2">Mineral Profile:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {product.minerals.map((mineral, i) => (
                                                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                                        {mineral}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <p className="text-sm text-gray-500">TDS</p>
                                                <p className="text-lg">{product.tds} mg/L</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">pH Level</p>
                                                <p className="text-lg">{product.ph}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-medium">R{product.price}</span>
                                            <button
                                                onClick={() => setCart([...cart, product])}
                                                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition flex items-center gap-2"
                                            >
                                                <i className="fas fa-shopping-cart"></i>
                                                <span>Add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                </section>

                {/* Water Science */}
                <section id="science" className="py-20 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-light mb-4">The Science of Water</h2>
                            <p className="max-w-2xl mx-auto text-gray-600">
                                Understanding what makes Hydrology different from ordinary water
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {waterFacts.map((fact, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-light mb-3">{fact.title}</h3>
                                    <p className="text-gray-600">{fact.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/2 h-64 md:h-auto relative">
                                    <Image
                                        src="/images/hydrology-source.jpeg"
                                        alt="Water sources map"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="md:w-1/2 p-8">
                                    <h3 className="text-2xl font-light mb-4">Global Sources</h3>
                                    <p className="text-gray-600 mb-6">
                                        Hydrology waters are sourced from pristine locations around the world, each selected for their unique geological properties and protected ecosystems.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-black mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Icelandic volcanic springs (Silica-rich)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-black mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Alpine glacier melt (Low mineral content)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-black mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Artisan wells in New Zealand (Balanced electrolytes)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hydration Guide */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-light mb-4">Optimal Hydration Guide</h2>
                            <p className="max-w-2xl mx-auto text-gray-600">
                                How to incorporate Hydrology waters into your daily routine for maximum benefit
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {hydrationGuide.map((item, index) => (
                                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-light mb-2">{item.time}</h3>
                                    <p className="text-gray-600 mb-2">{item.amount}</p>
                                    <p className="text-gray-800">{item.tip}</p>
                                </div>
                            ))}
                        </div>

                        <div className="max-w-3xl mx-auto bg-gray-100 p-8 rounded-lg">
                            <h3 className="text-2xl font-light mb-4">Water & Wellness</h3>
                            <p className="text-gray-600 mb-4">
                                The quality of water you drink affects everything from cognitive function to skin health. Hydrology's mineral-rich waters provide essential electrolytes that support:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['Cognitive Function', 'Digestion', 'Skin Health', 'Muscle Recovery', 'Energy Levels', 'Detoxification'].map((benefit) => (
                                    <div key={benefit} className="flex items-center">
                                        <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sustainability */}
                <section className="py-20 bg-black text-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                                <h2 className="text-3xl font-light mb-6">Sustainable Hydration</h2>
                                <p className="text-gray-300 mb-6">
                                    Every Hydrology bottle is made from 100% recycled glass and filled using renewable energy. Our carbon-negative production process ensures that for every liter sold, we protect two liters of freshwater sources.
                                </p>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <span>Certified B Corporation</span>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <div className="bg-gray-800 p-6 rounded-lg">
                                    <h3 className="text-xl font-light mb-4">Our Conservation Projects</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Protected 12 natural springs worldwide</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>100% plastic-free packaging</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Carbon-negative shipping</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-light mb-6">Experience Perfect Hydration</h2>
                        <p className="max-w-2xl mx-auto text-gray-600 mb-8">
                            Join thousands who have elevated their water experience with Hydrology
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="#products" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
                                Shop Collection
                            </Link>
                            <Link href="#top" className="border border-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition">
                                Back to Top
                            </Link>
                        </div>
                    </div>
                </section>
                {isCartOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-crimson-text">Shopping Cart</h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            {cart.length === 0 ? (
                                <p>Your cart is empty</p>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-y-auto">
                                        {cart.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center mb-4 border-b pb-4"
                                            >
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div className="ml-4 flex-1">
                                                    <h3 className="font-crimson-text">{item.name}</h3>
                                                    <p className="text-gray-600">R{item.price}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newCart = [...cart];
                                                        newCart.splice(index, 1);
                                                        setCart(newCart);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between mb-4">
                                            <span>Total:</span>
                                            <span>
                                                R
                                                {cart
                                                    .reduce((sum, item) => sum + item.price, 0)
                                                    .toFixed(2)}
                                            </span>
                                        </div>
                                        <button
                                            className="w-full bg-[#d4b26a] text-white py-2 rounded hover:bg-[#c4a25a]"
                                            onClick={() => setCheckoutStep(1)}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default HydrologyPage;