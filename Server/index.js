const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// middleware
app.use(cors());
app.use(express.json());      //req.body
app.use(express.urlencoded({ extended: true }));


app.get('/search', async (req, res) => {
    try {
        const allFlights = await pool.query(`SELECT * FROM flights`);
        res.json(allFlights.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.get('/searchFlight/:ticket_no', async (req, res) => {
    try {
        const flight = await pool.query(
            `SELECT * FROM flights 
        JOIN ticket_flights 
        ON flights.flight_id = ticket_flights.flight_id 
        JOIN ticket ON ticket_flights.ticket_no = ticket.ticket_no
        JOIN bookings ON ticket.book_ref = bookings.book_ref
        JOIN passengers ON ticket.passenger_id = passengers.passenger_id
        WHERE ticket.ticket_no = $1`, [req.params.ticket_no]);
        if (!flight.rows[0]) {
            res.json('Flight not found');
        } else {
            res.json(flight.rows[0])
        }
    }
    catch (err) {
        console.log(err.message);
    }
});

app.post('/book', async (req, res) => {
    console.log('req.body', req.body);
    const { fullname, email, telephone, address, city, state, zip, cardname, cardnumber, expiration, cvv, flightId } = req.body
    // Create that customer 
    try {
        const customer = await pool.query(`INSERT INTO passengers(passenger_name, email, phone) VALUES ($1, $2, $3) RETURNING *`, [fullname, email, telephone]);
        const customerData = customer.rows[0];

        // Amount is coming from the flight table 
        const flight = await pool.query('SELECT * FROM flights WHERE flight_id = $1', [flightId]);
        const flightInfo = flight.rows[0];
        const { price, gate_no, baggage_no, flight_id, scheduled_departure, seats_available, seats_booked } = flightInfo;


        const flightUpdated = await pool.query('UPDATE flights SET seats_available = $1, seats_booked = $2 WHERE flight_id = $3', [seats_available - 1, seats_booked + 1, flightId]);

        const booking = await pool.query(`INSERT INTO bookings(book_date, total_amount) VALUES ($1, $2) RETURNING *`, [scheduled_departure, price]);
        const bookingInfo = booking.rows[0];
        
        const payment = await pool.query('INSERT INTO payments(book_ref,payment_type,cardno,amount,tax,zip,state,address,city,name,expiration,cvv) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', [bookingInfo.book_ref, "credit", cardnumber, flightInfo.price, flightInfo.price * 0.08, zip, state, address, city, fullname, expiration, cvv])

        const letters = ['A', 'B', 'C', 'D', 'E', 'F']; // For our random seating 
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      
        const randomNumber = Math.floor(Math.random() * 50);
        const seatNo = randomLetter + randomNumber;
    
        const ticket = await pool.query(`INSERT INTO ticket(book_ref,passenger_id,seat_no) VALUES ($1, $2, $3) RETURNING *`, [bookingInfo.book_ref, customerData.passenger_id, seatNo]);
        const ticketInfo = ticket.rows[0]
        console.log(ticketInfo, ticketInfo.ticket_no, ticketInfo.ticket_no.length);

        const ticket_flights = await pool.query(`INSERT INTO ticket_flights(ticket_no, flight_id, amount) VALUES($1, $2, $3)`, [ticketInfo.ticket_no, flightId, price]);
        res.json({ bookingId: bookingInfo.book_ref.trim(), ticketId: ticketInfo.ticket_no.trim() });

    } catch (err) {
        console.log(err.message);
    }

})






app.listen(5000, () => {
    console.log("server has started on port 5000");
});
