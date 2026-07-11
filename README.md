# Vishnu Prasad & Karthikadevi — Wedding Invitation

A mobile-first, enchanted-forest wedding e-invitation.
Plain HTML/CSS/JS — no build step required.

## Files
- `index.html` — page content
- `styles.css` — styles and animations
- `script.js` — countdown, tap-to-open, fireflies, floating hearts
- `assets/forest-bg.jpg` — background (desktop, ~440 KB)
- `assets/forest-bg-mobile.jpg` — lighter background for phones (~184 KB)

## Preview locally
Just open `index.html` in a browser, or run a tiny local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Host on GitHub Pages
1. Create a new GitHub repository and push these files to the `main` branch.
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch `main`, folder `/ (root)`, then **Save**.
5. Wait a minute; your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.

### Share preview (optional but nice for WhatsApp)
Open `index.html` and update the two social-share lines in `<head>` with your
live URL so link previews show the forest image:

```html
<meta property="og:image" content="https://<user>.github.io/<repo>/assets/forest-bg.jpg" />
<meta name="twitter:image" content="https://<user>.github.io/<repo>/assets/forest-bg.jpg" />
```

## Wedding details
- **Betrothal:** Wednesday, 16 September 2026, 7:00 p.m. onwards
- **Wedding:** Thursday, 17 September 2026, 10:35 a.m. – 11:35 a.m.
- **Venue:** Master Printers Association Marriage Hall, Kamarajar Salai,
  Railway Feeder Road, Sivakasi
