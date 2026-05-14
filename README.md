# Echoes of the Forgotten Kingdom 🏰✨

A beautiful, elegant literary website inspired by fantasy storytelling with an elegant dark theme and golden accents.

## 🌟 Features

### Frontend (HTML/CSS/JavaScript)
- **Elegant Dark Theme**: Sophisticated dark brown/charcoal background with gold and cream accents
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Interactive Storytelling**: Smooth scroll navigation, audio narration buttons, and reading time calculations
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Animated Elements**: Subtle floating effects, smooth transitions, and scroll-triggered animations
- **Beautiful Typography**: Serif fonts (Playfair Display, Cinzel) for an elegant feel

### Backend (Python/Flask)
- **RESTful API**: Comprehensive endpoints for story management and user interactions
- **Database Management**: SQLite database for subscribers, stories, and user interactions
- **Email Subscription**: Secure email validation and subscriber management
- **Analytics**: Track user interactions like reading, listening, and sharing

### Design Philosophy
- **Elegant but not chaotic**: Careful color palette and spacing
- **Story-focused**: Content takes center stage
- **Literary aesthetic**: Inspired by classic book design
- **Medieval/Fantasy theme**: Appropriate imagery and decorative elements

## 📁 Project Structure

```
story website/
├── index.html          # Main HTML file
├── styles.css          # Complete styling (900+ lines of elegant CSS)
├── script.js           # Interactive JavaScript (400+ lines)
├── app.py              # Python Flask backend
├── requirements.txt    # Python dependencies
├── tales.db            # SQLite database (auto-created)
└── README.md           # This file
```

## 🚀 Getting Started

### Option 1: Frontend Only (No Backend)

1. Simply open `index.html` in your web browser
2. All features work offline except API calls to the backend

### Option 2: Full Stack (With Backend)

#### Prerequisites
- Python 3.7+
- pip (Python package manager)
- Modern web browser

#### Setup Instructions

1. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Python Backend**
   ```bash
   python app.py
   ```
   The server will run on `http://localhost:5000`

3. **Open the Website**
   - Open `index.html` in your web browser
   - Or serve it with a local HTTP server:
     ```bash
     # Python 3
     python -m http.server 8000
     ```
   - Then visit `http://localhost:8000`

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-dark: #0f0f0f;        /* Main background */
    --accent-gold: #d4a574;         /* Primary accent */
    --accent-light: #e8d5c4;        /* Text color */
    /* ... more colors ... */
}
```

### Fonts
Change the font imports in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap" rel="stylesheet">
```

### Content
- Edit story content in the `<article class="story-content">` section
- Update characters in the `<div class="characters-grid">` section
- Modify world information in the `<div class="world-content">` section

## 🔧 API Endpoints

### Subscriptions
- `POST /api/subscribe` - Subscribe to newsletter
- `GET /api/subscribers` - Get all subscribers
- `POST /api/unsubscribe/<email>` - Unsubscribe

### Stories
- `GET /api/stories` - Get all stories
- `GET /api/stories/<id>` - Get specific story
- `POST /api/stories` - Create new story (admin)

### Analytics
- `POST /api/interactions` - Log user interaction
- `GET /api/interactions/stats` - Get interaction statistics

### System
- `GET /api/health` - Health check
- `GET /api/info` - Service information

## 💻 Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Advanced styling with variables, gradients, animations
- **JavaScript (Vanilla)** - No frameworks, lightweight and fast
- **Google Fonts** - Beautiful typography

### Backend
- **Python 3** - Server-side logic
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite3** - Database management

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (optimized layout)
- **Mobile**: Below 768px (stacked layout)
- **Small Mobile**: Below 480px (condensed layout)

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Reduced motion support
- Focus indicators
- Form validation with helpful messages

## 🔒 Security Notes

- Email validation on both client and server
- CORS enabled for local development
- Input sanitization on all API endpoints
- Error handling without exposing sensitive information

## 📚 Story Structure

Each story follows this elegant structure:
- Opening tagline/chapter info
- Title with literary significance
- Featured image or illustration
- Main narrative with:
  - Drop caps for first letter
  - Justified paragraphs
  - Literary formatting
- Character descriptions
- World-building elements
- Call-to-action sections

## 🎯 Performance

- Optimized CSS with minimal selectors
- Vanilla JavaScript (no library overhead)
- SVG graphics for crisp, scalable images
- Efficient database queries
- Responsive image sizing
- Minimal external dependencies

## 📝 License

This project is created as a template for elegant literary websites. Feel free to modify and customize for your own stories.

## 🤝 Contributing

To improve this website:
1. Add more stories to the database
2. Create additional visual assets
3. Enhance the backend with email sending
4. Add social sharing features
5. Implement user authentication
6. Create an admin dashboard

## 🌟 Future Enhancements

- [ ] Email notifications with story excerpts
- [ ] User accounts and reading progress
- [ ] Audio narration playback
- [ ] Dark/light theme toggle
- [ ] Search functionality
- [ ] Story recommendations
- [ ] Social sharing buttons
- [ ] Author profiles
- [ ] Comment system
- [ ] Advanced analytics dashboard

## 📧 Support

For issues or questions, refer to the inline code comments throughout the project.

---

**Created with reverence for the tales that refuse to be forgotten.**

✦ ✦ ✦
