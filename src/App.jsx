import React, { useState, useEffect } from 'react';
import './App.css';
import { movies } from './movies';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, booking, ticket, history
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Booking state
  const [theatre, setTheatre] = useState('');
  const [showtime, setShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Ticket / History state
  const [currentTicket, setCurrentTicket] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('cinebook_history')) || [];
    setBookingHistory(history);
  }, []);

  const handleBookNow = (movie) => {
    setSelectedMovie(movie);
    setTheatre('Cineplex A');
    setShowtime('10:00 AM');
    setSelectedSeats([]);
    setCurrentPage('booking');
  };

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const ticket = {
      id: Date.now(),
      movieTitle: selectedMovie.title,
      theatre,
      showtime,
      seats: selectedSeats.join(', '),
      totalPrice: selectedSeats.length * selectedMovie.price,
      date: new Date().toLocaleDateString()
    };

    const newHistory = [ticket, ...bookingHistory];
    setBookingHistory(newHistory);
    localStorage.setItem('cinebook_history', JSON.stringify(newHistory));
    
    setCurrentTicket(ticket);
    setCurrentPage('ticket');
  };

  const renderHome = () => (
    <div>
      <h2>Now Showing</h2>
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img src={movie.image} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>{movie.genre}</p>
            <p>₹{movie.price} / ticket</p>
            <button className="book-btn" onClick={() => handleBookNow(movie)}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="booking-container">
      <h2>Book Tickets for {selectedMovie.title}</h2>
      
      <div className="form-group">
        <label>Select Theatre</label>
        <select value={theatre} onChange={(e) => setTheatre(e.target.value)}>
          <option value="Cineplex A">Cineplex A</option>
          <option value="Star Cinemas">Star Cinemas</option>
          <option value="Grand Screen">Grand Screen</option>
        </select>
      </div>

      <div className="form-group">
        <label>Select Showtime</label>
        <select value={showtime} onChange={(e) => setShowtime(e.target.value)}>
          <option value="10:00 AM">10:00 AM</option>
          <option value="01:30 PM">01:30 PM</option>
          <option value="06:00 PM">06:00 PM</option>
          <option value="09:00 PM">09:00 PM</option>
        </select>
      </div>

      <div className="form-group">
        <label>Select Seats</label>
        <div className="seats-grid">
          {Array.from({ length: 32 }, (_, i) => {
            const seatId = `S${i + 1}`;
            return (
              <div 
                key={seatId} 
                className={`seat ${selectedSeats.includes(seatId) ? 'selected' : ''}`}
                onClick={() => toggleSeat(seatId)}
              >
                {seatId}
              </div>
            );
          })}
        </div>
      </div>

      <div className="booking-summary">
        <p><strong>Selected Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
        <p><strong>Total Price:</strong> ₹{selectedSeats.length * selectedMovie.price}</p>
        <button className="book-btn" onClick={handleConfirmBooking}>Confirm Booking</button>
        <button className="book-btn" style={{backgroundColor: '#ccc', color: '#333', marginTop: '10px'}} onClick={() => setCurrentPage('home')}>Cancel</button>
      </div>
    </div>
  );

  const renderTicket = () => (
    <div className="ticket-container">
      <div className="ticket-header">
        <h2>CineBook Ticket</h2>
        <p>Booking Confirmed!</p>
      </div>
      <div className="ticket-details">
        <p><strong>Movie:</strong> {currentTicket.movieTitle}</p>
        <p><strong>Theatre:</strong> {currentTicket.theatre}</p>
        <p><strong>Showtime:</strong> {currentTicket.showtime} ({currentTicket.date})</p>
        <p><strong>Seats:</strong> {currentTicket.seats}</p>
        <p><strong>Total Paid:</strong> ₹{currentTicket.totalPrice}</p>
        <p><strong>Booking ID:</strong> {currentTicket.id}</p>
      </div>
      <button className="book-btn" onClick={() => setCurrentPage('home')}>Back to Home</button>
    </div>
  );

  const renderHistory = () => (
    <div>
      <h2>Your Booking History</h2>
      {bookingHistory.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="history-list">
          {bookingHistory.map(ticket => (
            <li key={ticket.id} className="history-item">
              <p><strong>{ticket.movieTitle}</strong> - {ticket.date}</p>
              <p>{ticket.theatre} | {ticket.showtime}</p>
              <p>Seats: {ticket.seats} | Paid: ₹{ticket.totalPrice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>CineBook</h1>
        <div className="nav-links">
          <button onClick={() => setCurrentPage('home')}>Movies</button>
          <button onClick={() => setCurrentPage('history')}>History</button>
        </div>
      </nav>

      <main className="content">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'booking' && renderBooking()}
        {currentPage === 'ticket' && renderTicket()}
        {currentPage === 'history' && renderHistory()}
      </main>
    </div>
  );
}

export default App;
