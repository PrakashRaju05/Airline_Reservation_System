
const express = require("express");
const cors = require("cors");
const flightsRoute = require("./routes/flights");
const reservationsRoute = require("./routes/reservations");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/flights", flightsRoute);
app.use("/api/reservations", reservationsRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
