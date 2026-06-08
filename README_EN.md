# 📬 Outlook Email Manager

<div align="center">

**Lightweight Outlook email manager powered by Cloudflare Workers**

🆓 100% Free · ☁️ No Server Required · 🌍 Global CDN · 🌗 Dark/Light Theme

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Hono](https://img.shields.io/badge/Hono-4-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![D1](https://img.shields.io/badge/D1-SQLite-003B57?logo=sqlite&logoColor=white)](https://developers.cloudflare.com/d1/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/roseforyou/cf-outlook-email/pulls)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/roseforyou/cf-outlook-email)

⚠️ This button **cannot one-click deploy** this project: it relies on a D1 database and Secrets, which require manually creating the DB, running migrations, and setting secrets — the button fails at framework detection. Please follow the 📖 [Deployment Guide](./docs/GUIDE.md) instead (~5 min).

🌐 [中文](./README.md) · 📖 [Deployment Guide](./docs/GUIDE.md) · 🔌 [API Docs](./docs/API.md)

</div>

---

| 🌙 Dark | ☀️ Light |
|:---:|:---:|
| ![Dark mode](./docs/preview.png) | ![Light mode](./docs/preview-light.png) |

## ✨ Features

- 🔐 **One-Click OAuth** — Authorize Outlook accounts via browser popup, no manual token copying
- 🔄 **Auto Token Refresh** — Automatically saves new refresh tokens on each use, preventing expiry
- 📦 **Batch Operations** — Import/export/delete/move in bulk, including per-row & selected export, with group & status filters
- 📨 **Email Reading** — Read inbox / junk / deleted via Microsoft Graph API with folder switching, aggregated view, paginated load-more, search and HTML rendering
- 📭 **Temp Email** — GPTMail API integration for disposable email addresses
- 🎨 **Polished Themes** — Dark / Light / Auto with glassmorphism, circle-swoop transition & ambient breathing glow
- 🆓 **Completely Free** — Runs on Cloudflare's free tier, no credit card needed

## 🚀 Quick Deploy

> 💡 See the [Deployment Guide](./docs/GUIDE.md) for full steps.

```bash
# 1. Clone & install
git clone https://github.com/roseforyou/cf-outlook-email.git
cd cf-outlook-email
pnpm install

# 2. Login to Cloudflare
pnpm exec wrangler login

# 3. Create D1 database (copy database_id to wrangler.toml)
pnpm exec wrangler d1 create outlook-email-db
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml, replace REPLACE_WITH_YOUR_DATABASE_ID

# 4. Set secrets
pnpm exec wrangler secret put ADMIN_PASSWORD
pnpm exec wrangler secret put COOKIE_SECRET

# 5. Initialize & deploy
pnpm exec wrangler d1 migrations apply outlook-email-db --remote
pnpm exec wrangler deploy
```

Visit the output URL and login with your password. 🎉

## 📮 Adding Accounts

Login → **Add Account** → **One-Click Auth** → Microsoft login popup → Authorize → Credentials auto-filled → Save.

Works with all Outlook / Hotmail / Live accounts. Bulk import supported (format: `email----password----client_id----refresh_token`).

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚙️ Runtime | Cloudflare Workers (TypeScript) |
| 🧭 Router | Hono |
| 🗄️ Database | Cloudflare D1 (SQLite) |
| 🎨 Frontend | Vanilla HTML/CSS/JS |
| 📧 Email | Microsoft Graph API |
| 🚀 Deploy | Wrangler |

## 💰 Free Tier Limits

| Resource | Free Quota | Sufficient? |
|----------|-----------|:-----------:|
| ⚡ Worker Requests | 100K/day | ✅ |
| ⏱️ CPU Time | 10ms/req | ✅ |
| 🌐 Subrequests | 50/req | ✅ (single account per request) |
| 💾 D1 Storage | 5 GB | ✅ |

## 🗺️ Roadmap

**Core features (implemented)**

- [x] 🔐 One-click OAuth & auto token refresh
- [x] 👤 Account management (CRUD, connection test)
- [x] 🗂️ Group management (custom colors, group & status filters)
- [x] 📦 Bulk import / export / delete / move
- [x] 📤 Per-row & selected export
- [x] 📨 Email reading (live fetch, search, HTML rendering)
- [x] 📁 Folder switching (Inbox / Junk / Deleted)
- [x] 🔀 Aggregated view (Inbox + Junk merged by time — great for finding codes)
- [x] 📄 Paginated load-more
- [x] 📭 Temp email (GPTMail integration)
- [x] 🎨 Theme switching + circle-swoop transition + breathing glow

**Planned (PRs welcome)**

- [ ] 🗑️ Delete emails (single / batch)
- [ ] 📎 Attachment download
- [ ] 🏷️ Tag system
- [ ] 🔑 External API + API Key (programmatic verification-code fetching)
- [ ] ⏰ Scheduled token refresh (Cron Trigger)
- [ ] 🤖 Telegram push for new emails

> ⚠️ Due to Cloudflare Workers platform limits, the following are not feasible: IMAP (Gmail / QQ / 163 and other non-Microsoft mailboxes), SMTP forwarding, HTTP/SOCKS5 proxy.

## ⚠️ Disclaimer

This project is intended for personal use to manage your own email accounts. Ensure you have legal authorization for all accounts you manage. The default Client ID is Mozilla Thunderbird's public ID for quick setup only — registering your own Azure app is recommended for production use. The author assumes no liability for any misuse.

## 🙏 Credits

This project is a rewrite of [xiaozhi349/outlookEmail](https://github.com/xiaozhi349/outlookEmail), originally built with Python Flask + SQLite. It has been migrated to Cloudflare Workers + D1 with a completely new frontend and backend. Thanks to the original author.

## 📜 License

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](./LICENSE)

Licensed under **GPL-3.0**. Free to use, modify, and distribute — but any distributed derivative must also be open-sourced under GPL-3.0 with full source code.
