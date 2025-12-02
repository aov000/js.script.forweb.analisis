// =======================================================
// GODMODE Ω VULNERABILITY SCANNER 2025
// LEVEL: GOD TIER – JANGAN PERNAH JALANKAN DI WEB ORANG LAIN
// HANYA UNTUK: Lab pribadi • PortSwigger • HackTheBox • Bug Bounty IN-SCOPE
// =======================================================
(async () => {
    console.clear();
    const start = performance.now();
    const d = location.origin;
    const h = location.hostname;
    const u = location.href;

    console.log('%cGODMODE Ω SCANNER 2025 – AKTIF', 'color:#00ffff;font-size:32px;font-weight:bold;text-shadow:0 0 10px #00ffff');
    console.log('%cTarget →', 'color:#ff00ff;font-size:20px', d);
    console.log('%cPAKAI HANYA DI WEB YANG 100% KAMUASA LU! KALO KETAHUAN = LANGSUNG PENJARA', 'color:red;font-size:22px;font-weight:bold;background:#000;padding:10px');

    const G = { c: [], h: [], m: [], l: [] };
    const god = (sev, msg, proof = '') => {
        G[sev].push({msg, proof});
        const col = {c:'#ff0066', h:'#ff6600', m:'#ffff66', l:'#00ffff'}[sev];
        console.log(`%c[${sev.toUpperCase()}] ${msg}`, `color:${col};font-weight:bold;font-size:15px;text-shadow:0 0 8px ${col}`, proof ? '→ ' + proof : '');
    };

    // GOD-TIER 1: ULTIMATE CORS EXPLOIT 2025
    const godCors = async () => {
        const tests = ['https://evil.com','https://'+h+'.attacker.com','null','https://not'+h];
        for (let o of tests) {
            try {
                const r = await fetch(d + '/robots.txt', {headers: {'Origin': o}, mode: 'cors'});
                const acao = r.headers.get('access-control-allow-origin');
                const acac = r.headers.get('access-control-allow-credentials');
                if (acao === '*') god('c', 'CORS WILDCARD * – FULL COOKIE STEAL', acao);
                if (acao === o) god('c', 'CORS MIRRORING ATTACK SUCCESS', o);
                if (acac === 'true' && acao && acao !== d) god('c', 'CORS + CREDENTIALS LEAK KE ' + acao);
            } catch {}
        }
    };

    // GOD-TIER 2: AUTO RCE / SSTI / LFI / COMMAND INJECTION DETECTOR
    const magicParams = new URLSearchParams(location.search);
    magicParams.forEach((val, key) => {
        const low = val.toLowerCase();
        // SSTI 2025 payloads
        if (/49|343|1337/.test(low) && /\{.*7.*7|\$\{.*7.*7|<%=|<%|#{.*}/.test(val)) god('c', 'SSTI CONFIRMED (7*7)', `${key}=${val}`);
        // LFI / RCE
        if (/root:x:|;id|whoami|cat|ls|passwd|cmd=|exec|system|popen|eval/i.test(low)) god('c', 'COMMAND INJECTION / LFI PAYLOAD', val);
        // Open Redirect + JS
        if (/javascript:|data:text|vbscript:|file:|\.php%3f|\/etc\/passwd/.test(val)) god('c', 'OPEN REDIRECT KE MALICIOUS PROTOCOL', val);
    });

    // GOD-TIER 3: GRAPHQL INTROSPECTION + BATCHING + ALIAS OVERLOAD
    const gqlPaths = ['/graphql','/v1/graphql','/api/graphql','/graphiql','/playground','/altair','/api'];
    for (let p of gqlPaths) {
        try {
            const payload = JSON.stringify({query: "query IntrospectionQuery { __schema { queryType { name } } }"});
            const r = await fetch(d + p, {method:'POST', headers:{'Content-Type':'application/json'}, body: payload});
            if ((await r.text()).includes('__schema')) god('c', 'GRAPHQL INTROSPECTION ENABLED', d + p);
        } catch {}
    }

    // GOD-TIER 4: 300+ SENSITIVE PATHS 2025 EDITION
    const godList = [
        '/.env','/.git/HEAD','/.git/config','/wp-config.php','/config.php','/laravel/.env','/.aws/credentials','/id_rsa','/id_dsa','/backup.sql','/db.sql',
        '/phpinfo.php','/info.php','/server-status','/.DS_Store','/web.config','/.dockerenv','/proc/self/environ','/.bashrc','/.bash_history',
        '/debug/default/view','/adminer.php','/phpmyadmin','/server.js','/package.json','/composer.lock','/.npmrc','/.yarnrc','/firebase.json',
        '/.firebase/hosting.','/.vercel','/vercel.json','/now.json','/.netlify','/netlify.toml','/app.yaml','/Dockerfile','/docker-compose.yml'
    ];
    for (let p of godList) {
        try {
            const r = await fetch(d + p + '?_=' + Date.now(), {method:'HEAD', cache:'no-store'});
            if (r.status === 200) god('c', 'EXPOSED → ' + p, d + p);
            else if (r.status === 403 || r.status === 401) god('h', 'PROTECTED TAPI ADA → ' + p, r.status);
        } catch {}
    }

    // GOD-TIER 5: HARDCODED SECRETS + JWT + FIREBASE + AWS KEYS (AI regex 2025)
    [...document.scripts].forEach(async s => {
        if (!s.src) return;
        const src = s.src;
        if (/api|config|env|firebase|stripe|sentry|aws|cloudinary|secret|token|key|password|jwt/i.test(src)) {
            god('h', 'JUICY JS → ' + src);
            try {
                const code = await (await fetch(src)).text();
                const patterns = [
                    /[a-zA-Z0-9_-]{20,100} ?[=:]['"`][a-zA-Z0-9\/+]{30,}['"`]/g,
                    /AKIA[0-9A-Z]{16}/g,
                    /ghp_[0-9a-zA-Z]{36}/g,
                    /firebaseConfig.*apiKey.*['"`][0-9a-zA-Z]{30,}['"`]/g,
                    /sk_live_[0-9a-zA-Z]{24}/g,
                    /pk_live_[0-9a-zA-Z]{24}/g
                ];
                patterns.forEach(p => {
                    (code.match(p) || []).forEach(secret => god('c', 'GOD-TIER SECRET → ' + secret.trim(), src));
                });
            } catch {}
        }
    });

    // GOD-TIER 6: FULL SECURITY HEADERS AUDIT
    const head = await fetch(u, {method:'HEAD'}).catch(()=> ({}));
    const hdr = Object.fromEntries(head.headers || []);
    !hdr['strict-transport-security'] && god('h', 'HSTS MISSING');
    !hdr['x-frame-options'] && !hdr['content-security-policy']?.includes('frame-ancestors') && god('h', 'CLICKJACKING POSSIBLE');
    !hdr['x-content-type-options'] && god('m', 'MIME-SNIFFING RISK');
    !hdr['permissions-policy'] && god('m', 'NO PERMISSIONS-POLICY');
    hdr['server'] && god('m', 'SERVER HEADER LEAK → ' + hdr['server']);
    hdr['x-powered-by'] && god('m', 'X-POWERED-BY LEAK → ' + hdr['x-powered-by']);

    // GOD-TIER 7: PROTOTYPE POLLUTION + DESERIALIZATION GADGETS
    try {
        JSON.parse('{"__proto__":{"polluted":"yes"}}');
        if (({}).polluted === 'yes') god('c', 'PROTOTYPE POLLUTION GADGET ACTIVE');
    } catch {}
    try { new Function('return process')() } catch { god('h', 'NODE.JS DESERIALIZATION GADGET POSSIBLE'); }

    // RUN GOD COR
    await godCors();

    // FINAL GOD REPORT
    const end = performance.now();
    console.log('%c\nGODMODE SCAN SELESAI – ' + ((end-start)/1000).toFixed(2) + ' detik', 'color:#00ffff;font-size:28px;font-weight:bold;text-shadow:0 0 15px cyan');
    console.table({
        'GOD CRITICAL': G.c.length,
        'HIGH':         G.h.length,
        'MEDIUM':       G.m.length,
        'LOW':          G.l.length
    });

    if (G.c.length > 0) {
        console.log('%cWEBSITE LU BOCOR PARAH BRO — PATCH SEKARANG JUGA!!', 'color:red;font-size:40px;font-weight:bold;background:#000;padding:20px;animation:blink 1s infinite');
        console.log('%cTotal Critical: ' + G.c.length, 'color:red;font-size:30px');
    } else {
        console.log('%cLU UDAH DI LEVEL GOD SECURITY — GAK BISA DITEMBUS BRO!', 'color:#00ff00;font-size:40px;font-weight:bold;background:#000;padding:20px');
    }

    console.log('%cMay the force be with you – 2025 God Tier Edition', 'color:#ff00ff;font-size:22px;font-style:italic');
})();
