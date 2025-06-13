'use client';
import { useState, useEffect } from 'react';

const BookingModal = ({
    isOpen,
    onClose,
    bookingData,
    onSubmit,
    errors,
    isSubmitted,
    isLoading,
    onInputChange
}) => {
    const [localBookingData, setLocalBookingData] = useState(bookingData);

    // Sync with parent component's bookingData
    useEffect(() => {
        setLocalBookingData(bookingData);
    }, [bookingData]);

    const handleLocalInputChange = (field, value) => {
        setLocalBookingData(prev => ({ ...prev, [field]: value }));
        onInputChange(field, value);
    };

    if (!isOpen) return null;

    return (
        <div className="booking-modal" >
            <div className="modal-content">
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className="modal-close-btn"
                >
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-body">
                    <div className="modal-header">
                        <h3 className="modal-title">{localBookingData.eventName}</h3>
                        <p className="modal-subtitle">
                            {localBookingData.eventType} Experience • {localBookingData.duration}
                        </p>
                        {localBookingData.highlights && (
                            <div className="experience-highlights-modal">
                                <h4 className="highlights-title">Experience Includes:</h4>
                                <ul>
                                    {localBookingData.highlights.map((highlight, i) => (
                                        <li key={i} className="highlight-item">
                                            <i className="fas fa-check-circle highlight-icon"></i>
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(localBookingData);
                    }} noValidate>
                        <div className="modal-form-grid">
                            {/* Left Column - Booking Details */}
                            <div className="form-column">
                                <h4 className="form-section-title">Booking Details</h4>

                                <div className="form-group">
                                    <label className="form-label">
                                        Date <span className="required">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-input ${isSubmitted && errors.date ? "error" : ""
                                            }`}
                                        value={localBookingData.date}
                                        onChange={(e) =>
                                            handleLocalInputChange("date", e.target.value)
                                        }
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                    />
                                    {isSubmitted && errors.date && (
                                        <p className="error-message">{errors.date}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Time <span className="required">*</span>
                                    </label>
                                    <select
                                        className={`form-input ${isSubmitted && errors.time ? "error" : ""
                                            }`}
                                        value={localBookingData.time}
                                        onChange={(e) =>
                                            handleLocalInputChange("time", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Select a time</option>
                                        {localBookingData.availableTimes.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                    {isSubmitted && errors.time && (
                                        <p className="error-message">{errors.time}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Number of Guests <span className="required">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="12"
                                        className={`form-input ${isSubmitted && errors.guests ? "error" : ""
                                            }`}
                                        value={localBookingData.guests}
                                        onChange={(e) =>
                                            handleLocalInputChange("guests", parseInt(e.target.value))
                                        }
                                        required
                                    />
                                    {isSubmitted && errors.guests && (
                                        <p className="error-message">{errors.guests}</p>
                                    )}
                                </div>

                                <div className="price-summary">
                                    <div className="price-row">
                                        <span>Price per person:</span>
                                        <span>R{localBookingData.price}</span>
                                    </div>
                                    <div className="price-total">
                                        <span>Total:</span>
                                        <span>R{localBookingData.price * localBookingData.guests}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Personal Information */}
                            <div className="form-column">
                                <h4 className="form-section-title">Your Information</h4>

                                <div className="form-group">
                                    <label className="form-label">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-input ${isSubmitted && errors.name ? "error" : ""
                                            }`}
                                        value={localBookingData.name}
                                        onChange={(e) =>
                                            handleLocalInputChange("name", e.target.value)
                                        }
                                        required
                                    />
                                    {isSubmitted && errors.name && (
                                        <p className="error-message">{errors.name}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Email Address <span className="required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-input ${isSubmitted && errors.email ? "error" : ""
                                            }`}
                                        value={localBookingData.email}
                                        onChange={(e) =>
                                            handleLocalInputChange("email", e.target.value)
                                        }
                                        required
                                    />
                                    {isSubmitted && errors.email && (
                                        <p className="error-message">{errors.email}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Phone Number <span className="required">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className={`form-input ${isSubmitted && errors.phone ? "error" : ""
                                            }`}
                                        value={localBookingData.phone}
                                        onChange={(e) =>
                                            handleLocalInputChange("phone", e.target.value)
                                        }
                                        required
                                    />
                                    {isSubmitted && errors.phone && (
                                        <p className="error-message">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Special Requests</label>
                                    <textarea
                                        className="form-textarea"
                                        rows="3"
                                        placeholder="Dietary restrictions, accessibility needs, etc."
                                        value={localBookingData.specialRequests}
                                        onChange={(e) =>
                                            handleLocalInputChange("specialRequests", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="booking-modal-footer">
                            <button
                                type="submit"
                                className={`modal-submit-btn ${isLoading ? "loading" : ""}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Processing...
                                    </>
                                ) : (
                                    `Confirm Booking for ${localBookingData.eventName}`
                                )}
                            </button>

                            {isSubmitted && Object.keys(errors).length > 0 && (
                                <p className="error-message">
                                    Please fix the errors above to continue
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default BookingModal;