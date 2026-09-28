module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const folderId = req.query.id || req.query.folderId;
  const resourceKey = req.query.resourcekey;

  if (!folderId) {
    return res.status(400).json({ error: "Missing folder id parameter" });
  }

  try {
    let driveUrl = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#list`;
    if (resourceKey) {
      driveUrl += `&resourcekey=${encodeURIComponent(resourceKey)}`;
    }

    const driveRes = await fetch(driveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!driveRes.ok) {
      return res.status(driveRes.status).send(`Google Drive returned ${driveRes.status}`);
    }

    const html = await driveRes.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (err) {
    console.error("Vercel api/folder error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch folder from Google Drive" });
  }
};
