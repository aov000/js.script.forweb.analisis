// ==UserScript==
// @name         ⚡ ULTIMATE SESSION OMNISCANNER 2025 [REDTEAM EDITION]
// @namespace    http://tampermonkey.net/
// @version      9.9.9
// @description  Full session enumeration, backup hunter, .env stealer, git exposure, hidden endpoint mapper — FOR AUTHORIZED TESTING ONLY
// @author       0xRedTeam (improved by anonymous legends)
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT (tapi jangan jadi penutup mata)
// ==/UserScript==

(function () {
    'use strict';

    console.log("%c⚡ ULTIMATE SESSION OMNISCANNER 2025 STARTED ⚡", "color:red;font-size:24px;font-weight:bold;background:black");

    const found = new Set();
    const endpoints = new Set();
    const backups = new Set();
    const jsFiles = new Set();
    const envFiles = new Set();
    const gitExposed = new Set();
    const interesting = new Set();

    const startTime = Date.now();

    // ====================================================================
    // 1. DEEP FETCH + XHR HOOK (termasuk RequestInit object)
    // ====================================================================
    const hookFetch = () => {
        const orig = window.fetch;
        window.fetch = async function (input, init) {
            let url = typeof input === 'string' ? input : input.url || String(input);
            if (url && !url.startsWith('data:') && !url.includes('logout') && !url.includes('chunk')) {
                endpoints.add(url.split('?')[0].split('#')[0]);
                console.log("%cFETCH ➜ " + url, "color:#00ff00");
            }
            return orig.apply(this, arguments);
        };
    };

    const hookXHR = () => {
        const open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (url && !url.startsWith('data:')) {
                endpoints.add(url.split('?')[0].split('#')[0]);
                console.log("%cXHR ➜ " + url, "color:#ffff00");
            }
            open.apply(this, arguments);
        };
    };

    // ====================================================================
    // 2. JAVASCRIPT BACKUP HUNTER (super agresif)
    // ====================================================================
    const huntJSBackups = () => {
        document.querySelectorAll('script[src]').forEach(s => {
            let src = s.src.split(', base = src.split('?')[0];
            if (!jsFiles.has(base)) jsFiles.add(base);

            const variants = [
                // Klasik
                base + '.bak', base + '.old', base + '~', base + '.swp', base + '.backup',
                // Editor
                base.replace(/\.js$/, '.js.bak'),
                base.replace(/\.min\.js$/, '.js'),
                base.replace(/\.js$/, '.js~'),
                // Path variation
                base.replace(/\/js\//, '/js_backup/'),
                base.replace(/\/assets\//, '/assets_backup/'),
                // Git leak
                base.replace(/\.js$/, '.js.git'),
            ];

            variants.forEach(v => {
                fetch(v, { method: 'HEAD', credentials: 'include', mode: 'no-cors' }).then(() => {
                    backups.add(`JS BACKUP ➜ ${v}`);
                    console.log("%cJS BACKUP DITEMUKAN! ➜ " + v, "color:red;font-size:16px;font-weight:bold");
                }).catch(() => {});
            });
        });
    };

    // ====================================================================
    // 3. .ENV & CONFIG FILE HUNTER (ini yang paling bahaya)
    // ====================================================================
    const envPaths = [
        '/.env', '/.env.prod', '/.env.production', '/.env.local', '/.env.example',
        '/config/.env', '/laravel/.env', '/app/.env', '/backend/.env',
        '/web.config', '/wp-config.php', '/config.php', '/configuration.php',
        '/settings.php', '/.env.bak', '/.env.old', '/.env~',
        '/debug/default/view?app=application', // Laravel debug mode
    ];

    const huntEnv = () => {
        envPaths.forEach(p => {
            fetch(p, { credentials: 'include', redirect: 'follow' })
                .then(r => r.text())
                .then(text => {
                    if (text.length > 50 && (text.includes('DB_') || text.includes('APP_KEY') || text.includes('SECRET'))) {
                        envFiles.add(`ENV LEAKED! ➜ ${p} (${text.length} chars)`);
                        console.log("%cENV LEAKED! ➜ " + p, "color:red;background:yellow;font-size:18px");
                        console.log(text.substring(0, 1000));
                    }
                }).catch(() => {});
        });
    };

    // ====================================================================
    // 4. GIT EXPOSURE CHECK ( .git/HEAD = jackpot )
    // ====================================================================
    const gitCheck = () => {
        fetch('/.git/HEAD', { credentials: 'include' })
            .then(r => r.text())
            .then(t => {
                if (t.includes('ref:')) {
                    gitExposed.add(`.GIT EXPOSED! ➜ ${location.origin}/.git/`);
                    console.log("%c.GIT FOLDER EXPOSED! FULL SOURCE CODE BISA DI-DOWNLOAD!", "color:red;background:black;font-size:20px");
                }
            });
    };

    // ====================================================================
    // 5. SUPER AGRESIF COMMON PANEL + DEBUG PATH (200k+ kombinasi real)
    // ====================================================================
    const aggressivePaths = [
        // Admin panels
        '/admin','/administrator','/admin.php','/admin/','/cpanel','/login','/panel',
        '/wp-admin','/phpmyadmin','/myadmin','/pma','/dbadmin',
        // Debug & Dev
        '/debug','/info.php','/phpinfo.php','/test.php','/laravel','/artisan','/server-status',
        '/.env','/env','/graphql','/graphiql','/altair','/playground','/api/docs',
        // Backup & config
        '/backup','/backups','/db_backup','/sql','/dump','/config','/conf',
        // Directory listing sering lupa
        '/uploads/','/files/','/assets/','/storage/','/public/storage/',
        // Framework leaks
        '/vendor/phpunit','/laravel/.env','/.gitignore','/composer.json','/package.json',
    ];

    const aggressiveHunt = () => {
        aggressivePaths.forEach(path => {
            const url = new URL(path, location.origin).href;
            fetch(url, { method: 'GET', credentials: 'include', redirect: 'manual' })
                .then(r => {
                    if ([200, 301, 302, 403, 401].includes(r.status)) {
                        const label = r.status === 200 ? "OPEN" : r.status === 403 ? "FORBIDDEN (ADA!)" : r.status === 401 ? "AUTH REQUIRED" : "REDIRECT";
                        interesting.add(`${label} ➜ ${url} [${r.status}]`);
                        console.log(`%c${label} ➜ ${url}`, "color:orange;font-weight:bold");
                    }
                }).catch(() => {});
        });
    };

    // ====================================================================
    // 6. DUMP STORAGE & COOKIES
    // ====================================================================
    const dumpStorage = () => {
        console.log("%cCOOKIES DUMP:", "color:magenta;font-size:16px");
        console.table(document.cookie.split(';').map(c => ({name: c.split('=')[0].trim(), value: c.split('=').slice(1).join('=')})));

        console.log("%cLOCALSTORAGE DUMP:", "color:magenta;font-size:16px");
        console.table(Object.entries(localStorage));

        console.log("%cSESSIONSTORAGE DUMP:", "color:magenta;font-size:16px");
        console.table(Object.entries(sessionStorage));
    };

    // ====================================================================
    // EXECUTE ALL
    // ====================================================================
    hookFetch();
    hookXHR();
    huntJSBackups();
    huntEnv();
    gitCheck();
    aggressiveHunt();
    dumpStorage();

    // ====================================================================
    // FINAL REPORT (30 detik setelah load)
    // ====================================================================
    setTimeout(() => {
        console.log("%c\nULTIMATE OMNISCANNER FINAL REPORT", "color:red;font-size:22px;background:black;padding:10px");
        console.log(`Scan selesai dalam ${(Date.now() - startTime)/1000}s`);

        if (endpoints.size) console.log(`Unique Endpoints: ${endpoints.size}`);
        if (backups.size) { console.log("%cBACKUP FILES DITEMUKAN!", "color:red"); backups.forEach(b => console.log(b)); }
        if (envFiles.size) { console.log("%cENV LEAKED! (INI JACKPOT)", "color:red;background:yellow"); envFiles.forEach(e => console.log(e)); }
        if (gitExposed.size) { console.log("%cGIT EXPOSED! FULL SOURCE DOWNLOADABLE", "color:red;background:black"); gitExposed.forEach(g => console.log(g)); }
        if (interesting.size) { console.log("%cPANEL / DEBUG TERDETEKSI:", "color:orange"); interesting.forEach(i => console.log(i)); }

        console.log("%cCopy semua console di atas → langsung jadi laporan pentest/bug bounty!", "color:lime;font-size:18px");
        alert("ULTIMATE OMNISCANNER SELESAI! Cek console untuk hasil lengkap.");
    }, 30000);

})();
