
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const filePath = path.join(__dirname, "../data/reservations.json");

router.get("/", (req, res) => {
  const reservations = JSON.parse(fs.readFileSync(filePath));
  res.json(reservations);
});

router.post("/", (req, res) => {
  const newReservation = req.body;
  const reservations = JSON.parse(fs.readFileSync(filePath));
  reservations.push(newReservation);
  fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2));
  res.status(201).json({ message: "Reservation created", id: newReservation.id });
});

router.get("/email/:email", (req, res) => {
  const reservations = JSON.parse(fs.readFileSync(filePath));
  const userReservations = reservations.filter(r => r.passenger.email === req.params.email);
  res.json(userReservations);
});

router.get("/download/:id", (req, res) => {
  const reservations = JSON.parse(fs.readFileSync(filePath));
  const reservation = reservations.find(r => r.id === req.params.id);

  if (!reservation) return res.status(404).send("Reservation not found");

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${reservation.id}.pdf`);

  doc.fontSize(20).text("SkyWings Airlines - Booking Confirmation", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Reservation ID: ${reservation.id}`);
  doc.text(`Flight: ${reservation.flight.flightNumber} - ${reservation.flight.airline}`);
  doc.text(`Route: ${reservation.flight.origin} → ${reservation.flight.destination}`);
  doc.text(`Departure: ${reservation.flight.departureTime}`);
  doc.text(`Arrival: ${reservation.flight.arrivalTime}`);
  doc.text(`Passenger: ${reservation.passenger.firstName} ${reservation.passenger.lastName}`);
  doc.text(`Email: ${reservation.passenger.email}`);
  doc.text(`Seat: ${reservation.seatNumber}`);
  doc.text(`Total: ₹${reservation.totalAmount}`);
  doc.end();
  doc.pipe(res);
});

module.exports = router;
