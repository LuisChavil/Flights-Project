let flights = [];
const setflights = (data) => {
    flights = data;
}

const displayFlights = () => {
    const flightsTable = document.querySelector('.rows');

    // display all todos by modifying the HTML in "todo-table"
    let tableHTML = "";
    flights.map(flight => {
        tableHTML +=
            `<tr key=${flight.flight_no}>
                <td>${flight.flight_no}</td>
                <td>${flight.departure_airport}</td>
                <td>${flight.arrival_airport}</td>
                <td>${new Date(flight.scheduled_departure).toLocaleString('en-US')}</td>
                <td>${new Date(flight.scheduled_arrival).toLocaleString('en-US')}</td>
                <td>${flight.seats_available}</td>
                <td>$${Math.floor(flight.price * 1.08)}</td>
                <td>${flight.flight_meal}</td>
                <td>${flight.flight_movie}</td>
                <td><button class="btn btn-primary book_flight_button" data-id="${flight.flight_id}">Book</button></td> 
            </tr>`;
    })
    flightsTable.innerHTML = tableHTML;

    const bookButtons = document.querySelectorAll('.book_flight_button'); // Button to book 
    for (var i = 0; i < bookButtons.length; i++) {
        bookButtons[i].addEventListener('click', function (event) {
            const flightId = this.dataset.id;
            console.log(flightId);
            window.location.replace(`./book.html?flight=${flightId}`);
            //    bookFlight(flightId);
        });
    }

}

document.querySelector('#searchFlight').addEventListener('click', async function (e) {
    e.preventDefault();
    const ticket_no = document.getElementById('ticket_no').value

    const response = await fetch(`http://localhost:5000/searchFlight/${ticket_no}`)

    const flightData = await response.json();
    console.log('flightData?,', flightData);

    // Display all that information to the user 
    const { flight_id, flight_no, scheduled_departure, scheduled_arrival, departure_airport, arrival_airport, status, aircraft_code, email, phone, seat_no, book_date, total_amount, passenger_name, gate_no, amount } = flightData;
    //  window.location.replace(`./confirmation.html?ticket=${flightData.ticketId}&booking=${flightData.bookingId}`);

    if (flightData === 'Flight not found') {
        const html = `
            <p>Flight not found</p>
        `
        document.querySelector('.flight_information').innerHTML = html;
    } else {
        const html = `
            <div class="card" style="width: 600px; margin: 0 auto;">
            <div class="card-body">
                <h5 class="card-title">Passenger Name: ${passenger_name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Email: ${email}</h6>
                <p class="card-text">From: ${departure_airport}</p>
                <p class="card-text">To: ${arrival_airport}</p>
                <p class="card-text">Boarding Time: ${new Date(scheduled_departure).toLocaleString('en-US')}</p>
                <p class="card-text">Gate: ${gate_no}</p>
                <p class="card-text">Seat: ${seat_no}</p>
                <p class="card-text">Price: $${Math.floor(amount) * 1.08}</p>
                <p class="card-text">Flight #: ${flight_no}</p>
            </div>
        </div>
        `
        document.querySelector('.flight_information').innerHTML = html;
    }





})

function format_time(s) {
    const dtFormat = new Intl.DateTimeFormat('en-US', {
        timeStyle: 'medium',
        timeZone: 'UTC'
    });

    return dtFormat.format(new Date(s * 1e3));
}


async function selectFlights() {
    // use try... catch... to catch error
    try {

        // GET all todos from "http://localhost:5000/search"
        const response = await fetch("http://localhost:5000/search")
        const jsonData = await response.json();

        setflights(jsonData);
        displayFlights();

    } catch (err) {
        console.log(err.message);
    }
}

selectFlights();