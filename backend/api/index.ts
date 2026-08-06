import { createApp } from "../src/app";

// Vercel's Node runtime accepts an Express app directly as a request
// handler (it matches the (req, res) signature). No separate http.Server
// or app.listen() needed - Vercel invokes this per-request.
export default createApp();
