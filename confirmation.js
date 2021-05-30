document.addEventListener("DOMContentLoaded", function () {
    var url = new URL(window.location.href);
    var ticket = url.searchParams.get("ticket");
    var booking = url.searchParams.get("booking");
    document.getElementById('booking_id').innerHTML = `For your reference, your booking ID is ${booking}`;
    document.getElementById('ticket_id').innerHTML = `For your reference, your ticket ID is ${ticket}`;
});
