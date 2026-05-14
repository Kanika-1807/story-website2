"""
ECHOES OF THE FORGOTTEN KINGDOM
Python Backend - Flask API Server
=====================================

This server handles:
- Email subscriptions
- Story data management
- User interactions logging
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import json
from datetime import datetime
import re
from pathlib import Path

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
DATABASE = 'tales.db'
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Database initialization
def init_database():
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    # Subscribers table
    c.execute('''CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN DEFAULT 0,
        active BOOLEAN DEFAULT 1
    )''')
    
    # Stories table
    c.execute('''CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        content TEXT NOT NULL,
        author TEXT DEFAULT 'The Keeper',
        published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'published'
    )''')
    
    # User interactions table
    c.execute('''CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        action TEXT,
        story_id INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        details TEXT
    )''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_database()

# ========================================
# UTILITY FUNCTIONS
# ========================================

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# ========================================
# SUBSCRIPTION ENDPOINTS
# ========================================

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    """Handle email subscription"""
    data = request.get_json()
    
    # Validate input
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    
    email = data['email'].strip().lower()
    
    # Validate email format
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Insert subscriber
        c.execute('''INSERT INTO subscribers (email, subscription_date, active)
                     VALUES (?, ?, 1)''', (email, datetime.now()))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Successfully subscribed to our tales',
            'email': email,
            'timestamp': datetime.now().isoformat()
        }), 201
        
    except sqlite3.IntegrityError:
        # Email already exists
        return jsonify({
            'success': False,
            'message': 'This email is already subscribed'
        }), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/subscribers', methods=['GET'])
def get_subscribers():
    """Get list of subscribers (admin endpoint)"""
    # In production, add authentication
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT id, email, subscription_date, active FROM subscribers WHERE active = 1')
        subscribers = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({
            'success': True,
            'count': len(subscribers),
            'subscribers': subscribers
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/unsubscribe/<email>', methods=['POST'])
def unsubscribe(email):
    """Unsubscribe from mailing list"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('UPDATE subscribers SET active = 0 WHERE email = ?', (email,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Successfully unsubscribed'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================================
# STORY ENDPOINTS
# ========================================

@app.route('/api/stories', methods=['GET'])
def get_stories():
    """Get all stories"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT * FROM stories WHERE status = "published" ORDER BY published_date DESC')
        stories = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({
            'success': True,
            'count': len(stories),
            'stories': stories
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stories/<int:story_id>', methods=['GET'])
def get_story(story_id):
    """Get a specific story"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT * FROM stories WHERE id = ? AND status = "published"', (story_id,))
        story = c.fetchone()
        conn.close()
        
        if not story:
            return jsonify({'error': 'Story not found'}), 404
        
        return jsonify({
            'success': True,
            'story': dict(story)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stories', methods=['POST'])
def create_story():
    """Create a new story (admin only)"""
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['title', 'chapter', 'content']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''INSERT INTO stories (title, chapter, content, author, status)
                     VALUES (?, ?, ?, ?, ?)''',
                  (data['title'], data['chapter'], data['content'],
                   data.get('author', 'The Keeper'), 'published'))
        conn.commit()
        story_id = c.lastrowid
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Story created successfully',
            'story_id': story_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================================
# INTERACTION ENDPOINTS
# ========================================

@app.route('/api/interactions', methods=['POST'])
def log_interaction():
    """Log user interactions (reading, listening, sharing, etc.)"""
    data = request.get_json()
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''INSERT INTO interactions (user_id, action, story_id, details)
                     VALUES (?, ?, ?, ?)''',
                  (data.get('user_id'), data.get('action'), 
                   data.get('story_id'), json.dumps(data.get('details', {}))))
        conn.commit()
        interaction_id = c.lastrowid
        conn.close()
        
        return jsonify({
            'success': True,
            'interaction_id': interaction_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/interactions/stats', methods=['GET'])
def get_interaction_stats():
    """Get interaction statistics"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        c.execute('SELECT action, COUNT(*) as count FROM interactions GROUP BY action')
        stats = {row[0]: row[1] for row in c.fetchall()}
        
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================================
# HEALTH & INFO ENDPOINTS
# ========================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Echoes of the Forgotten Kingdom',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/info', methods=['GET'])
def get_info():
    """Get service information"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        c.execute('SELECT COUNT(*) as count FROM subscribers WHERE active = 1')
        subscriber_count = c.fetchone()[0]
        
        c.execute('SELECT COUNT(*) as count FROM stories WHERE status = "published"')
        story_count = c.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'service': 'Echoes of the Forgotten Kingdom API',
            'version': '1.0.0',
            'subscribers': subscriber_count,
            'stories': story_count,
            'api_documentation': '/api/docs'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================================
# ERROR HANDLERS
# ========================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The requested resource does not exist'
    }), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

# ========================================
# MAIN EXECUTION
# ========================================

if __name__ == '__main__':
    # Run the Flask application
    # In production, use a WSGI server like Gunicorn
    app.run(debug=True, host='localhost', port=5000)
