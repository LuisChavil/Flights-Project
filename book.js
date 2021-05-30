
var url = new URL(window.location.href);
var flightId = url.searchParams.get("flight");
console.log(flightId);

document.querySelector('.book').addEventListener('click', async function (e) {
    e.preventDefault();
    const formData = new FormData(document.querySelector('#form'));
    const data = {};
    for (var pair of formData.entries()) {
        const fieldName = pair[0];
        const fieldValue = pair[1];
        data[fieldName] = fieldValue;
    }
    data.flightId = flightId;
    console.log(data);

    const response = await fetch('http://localhost:5000/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const flightData = await response.json();
    console.log('flightData?,', flightData);
    window.location.replace(`./confirmation.html?ticket=${flightData.ticketId}&booking=${flightData.bookingId}`);

})


// Customer information 
// ID, name, telephone, email, 
// Flight ID for ticket_flights
// Ticket ID, amount 
// Book Ref #
// Book Date
// Total amount 
// Payment information
// Card number, taxes, discounts