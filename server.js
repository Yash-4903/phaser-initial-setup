    const http = require('http');
    const fs = require('fs');
    const path = require('path');

    const ALLOWED_FILES = ['start.js', 'game.js', 'end.js'];
    const PORT = 8000;

    const server = http.createServer((req, res) => {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.method === 'POST' && req.url === '/save-layout') {
            let body = '';

            req.on('data', chunk => { body += chunk.toString(); });

            req.on('end', () => {
                try {
                    const { layoutName, layoutCode, fileName } = JSON.parse(body);

                    // Security check
                    if (!ALLOWED_FILES.includes(fileName)) {
                        res.writeHead(403, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `File not allowed: ${fileName}` }));
                        return;
                    }

                    const FILE_TO_UPDATE = path.join(__dirname, 'scenes', fileName);
                    let fileContent = fs.readFileSync(FILE_TO_UPDATE, 'utf8');

                    const regex = new RegExp(
                        `(this\.${layoutName}\s*=\s*\{)[^]*?(\};)`,
                        'm'
                    );

                    if (!regex.test(fileContent)) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `${layoutName} not found in ${fileName}` }));
                        return;
                    }

                    const updated = fileContent.replace(regex, layoutCode);
                    fs.writeFileSync(FILE_TO_UPDATE, updated, 'utf8');

                    console.log(`✅ ${layoutName} updated in ${fileName}`);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));

                } catch (err) {
                    console.error('❌ Error:', err.message);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                }
            });

            return;
        }

        res.writeHead(404);
        res.end('Not found');
    });

    server.listen(PORT, () => {
        console.log(`🚀 UI Editor server running at http://localhost:${PORT}`);
    });
    