from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

# Event to handle text changes
@socketio.on('text_change')
def handle_text_change(data):
    # Broadcast the text change to all clients
    emit('update_text', data, broadcast=True)

# Event to handle speech commands
@socketio.on('speak_text')
def handle_speak_text(data):
    # Broadcast the text to speak to all clients
    emit('broadcast_speak', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
