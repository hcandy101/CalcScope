import { app } from "./app.js";
import { env } from "./config/env.js";

// index.ts is intentionally tiny: it starts the HTTP process and leaves app setup
// in app.ts so tests can import the Express app later without opening a port.
app.listen(env.port, () => {
  console.log(`CalcScope API listening on http://localhost:${env.port}`);
});
