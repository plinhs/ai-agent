require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");



const app = express();
app.use(cors());
app.use(express.json());

const MIDTERM_BASE= process.env.MIDTERM_BASE;
const MIDTERM_API_KEY_BANK= process.env.MIDTERM_API_KEY_BANK;
const MIDTERM_API_KEY_MOBILE=process.env.MIDTERM_API_KEY_MOBILE
const MIDTERM_API_KEY_WEB=process.env.MIDTERM_API_KEY_WEB
const MIDTERM_API_KEY_ADMIN=process.env.MIDTERM_API_KEY_ADMIN

function mustHaveEnv() {
  if (!MIDTERM_BASE) throw new Error("Missing MIDTERM_BASE in services/gateway/.env");
  if (!MIDTERM_API_KEY_MOBILE) throw new Error("Missing MIDTERM_KEY_MOBILE in services/gateway/.env");
  if (!MIDTERM_API_KEY_WEB) throw new Error("Missing MIDTERM_KEY_WEB in services/gateway/.env");
}


app.get("/health", (req, res) => res.json({ ok: true }));



app.get("/agent/query-bill", async (req, res) => {
  try {
    mustHaveEnv();
    const { subscriber_no, month } = req.query;

    const r = await axios.get(`${MIDTERM_BASE}/mobile/bills`, {
      headers: { "X-API-KEY": MIDTERM_API_KEY_MOBILE },
      params: { subscriber_no, month },
    });

    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response?.status || 500).json({
      error: e.message,
      details: e.response?.data,
    });
  }
});

app.get("/agent/query-bill-detailed", async (req, res) => {
  try {
    mustHaveEnv();
    const { subscriber_no, month } = req.query;

    const r = await axios.get(`${MIDTERM_BASE}/mobile/bills/detailed`, {
      headers: { "X-API-KEY": MIDTERM_API_KEY_MOBILE },
      params: { subscriber_no, month },
    });

    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response?.status || 500).json({
      error: e.message,
      details: e.response?.data,
    });
  }
});

app.post("/agent/pay-bill", async (req, res) => {
  try {
    mustHaveEnv();
    const r = await axios.post(`${MIDTERM_BASE}/web/pay-bill`, req.body, {
      headers: { "X-API-KEY": MIDTERM_API_KEY_WEB },
    });

    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response?.status || 500).json({
      error: e.message,
      details: e.response?.data,
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Gateway running on http://127.0.0.1:${port}`));
