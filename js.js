// ==UserScript==
// @name         ULTIMATE SESSION OMNISCANNER 2025 [REDTEAM EDITION]
// @namespace    http://tampermonkey.net/
// @version      9.9.9
// @description  Full session enumeration + backup/.env/git hunter — AUTHORIZED TESTING ONLY
// @author       0xRedTeam
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    console.log("%cULTIMATE SESSION OMNISCANNER 2025 STARTED", "color:red;font-size:24px;font-weight:bold;background:black");

    const startTime = Date.now();
    const endpoints = new Set();
    const backups   = new Set();
    const envFiles  = new Set();
    const gitExposed = new Set();
    const interesting = new Set();

    // 1. Hook fetch & XHR
    const origFetch = window.fetch;
    window.fetch = async function (input, init) {
        let url = typeof input === 'string' ? input : (input.url || String(input));
        if (url && !url.startsWith('data:') && !url.includes('logout') && !url.includes('chunk')) {
            endpoints.add(url.split('?')[0].split('#')[0]);
            console.log("%cFETCH ➜ " + url, "color:#00ff00");
        }
        return origFetch.apply(this, arguments);
    };

    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url && !url.startsWith('data:')) {
            endpoints.add(url.split('?')[0].split('#')[0]);
            console.log("%cXHR ➜ " + url, "color:#ffff00");
        }
        origOpen.apply(this, arguments);
    };

    // 2. JS backup hunter (FIXED!)
    const huntJSBackups = () => {
        document.querySelectorAll('script[src]').forEach(script => {
            let src = script.src.split('?')[0].split('#')[0];
            if (!src || jsFiles.has(src)) return;
            jsFiles.add(src);

            const variants = [
                src + '.bak', src + '.old', src + '~', src + '.swp', src + '.backup',
                src.replace(/\.min\.js$/, '.js'),
                src.replace(/\.js$/, '.js.bak'),
                src.replace(/\.js$/, '.js~'),
            ];

            variants.forEach(variant => {
                fetch(variant, { method: 'HEAD', credentials: 'include', mode: 'no-cors' })
                    .then(() => {
                        backups.add(`JS BACKUP → ${variant}`);
                        console.log("%cJS BACKUP DITEMUKAN → " + variant, "color:red;font-weight:bold");
                    })
                    .catch(() => {});
            });
        });
    };

    // 3. .env & config hunter
    const envPaths = [
        '/.env','/.env.prod','/.env.local','/.env.example','/.env.bak','/.env.old',
        '/config/.env','/laravel/.env','/app/.env','/backend/.env',
        '/wp-config.php','/config.php','/configuration.php','/web.config'
    ];
    envPaths.forEach(p => {
        fetch(p, { credentials: 'include' })
            .then(r => r.text())
            .then(text => {
                if (text.length > 50 && (text.includes('DB_') || text.includes('APP_KEY') || text.includes('SECRET') || text.includes('PASSWORD'))) {
                    envFiles.add(`ENV LEAKED → ${p} (${text.length} chars)`);
                    console.log("%cENV LEAKED → " + p, "color:red;background:yellow;font-size:18px");
                    console.log(text.substring(0, 1000));
                }
            })
            .catch(() => {});
    });

    // 4. .git exposure
    fetch('/.git/HEAD', { credentials: 'include' })
        .then(r => r.text())
        .then(t => {
            if (t.includes('ref:')) {
                gitExposed.add('.GIT EXPOSED → ' + location.origin + '/.git/');
                console.log("%c.GIT FOLDER EXPOSED! FULL SOURCE DOWNLOADABLE!", "color:red;background:black;font-size:22px");
            }
        })
        .catch(() => {});

    // 5. Aggressive path hunter
    const paths = [
        '/admin','/administrator','/wp-admin','/phpmyadmin','/debug','/info.php','/test.php',
        '/graphql','/graphiql','/playground','/backup','/backups','/uploads/','/storage/',
        '/server-status','/laravel','/artisan','/.env','/env'
    ];
    paths.forEach(p => {
        const url = new URL(p, location.origin).href;
        fetch(url, { method: 'GET', credentials: 'include', redirect: 'manual' })
            .then(r => {
                if ([200,301,302,401,403].includes(r.status)) {
                    const label = r.status === 200 ? "OPEN" : r.status === 403 ? "FORBIDDEN (ADA!)" : r.status === 401 ? "NEED AUTH" : "REDIRECT";
                    interesting.add(`${label} → ${url} [${r.status}]`);
                    console.log(`%c${label} → ${url}`, "color:orange;font-weight:bold");
                }
            })
            .catch(() => {});
    });

    // 6. Dump storage
    console.log("%cCOOKIES:", "color:magenta;font-size:16px");
    console.table(document.cookie.split(';').map(c => ({name: c.split('=')[0].trim(), value: c.split('=').slice(1).join('=').trim()})));

    console.log("%cLOCALSTORAGE:", "color:magenta;font-size:16px");
    console.table(Object.fromEntries(Object.entries(localStorage)));

    // 7. Final report setelah 30 detik
    setTimeout(() => {
        console.log("%c\nULTIMATE OMNISCANNER FINAL REPORT", "color:red;font-size:22px;background:black;padding:10px");
        console.log(`Scan selesai dalam ${(Date.now() - startTime)/1000} detik`);

        if (endpoints.size)   { console.log("%cEndpoints ("+endpoints.size+"):", "color:cyan");   [...endpoints].slice(0,200).forEach(e=>console.log(" → "+e)); }
        if (backups.size)     { console.log("%cBACKUP FILES:", "color:red");     backups.forEach(b=>console.log(b)); }
        if (envFiles.size)    { console.log("%cENV LEAKED!", "color:red;background:yellow"); envFiles.forEach(e=>console.log(e)); }
        if (gitExposed.size)  { console.log("%cGIT EXPOSED!", "color:red;background:black"); gitExposed.forEach(g=>console.log(g)); }
        if (interesting.size) { console.log("%cINTERESTING PATHS:", "color:orange"); interesting.forEach(i=>console.log(i)); }

        console.log("%cCopy semua console → langsung jadi laporan!", "color:lime;font-size:18px");
        alert("ULTIMATE OMNISCANNER SELESAI – cek console untuk hasil lengkap!");
    }, 30000);

    // Jalankan yang bisa langsung dijalankan
    huntJSBackups();

})();
