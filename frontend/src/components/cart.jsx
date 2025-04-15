
import React from 'react'

function cart() {
    return (
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
    )
}

export default cart