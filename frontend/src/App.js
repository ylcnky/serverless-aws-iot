import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.onSend = this.onSend.bind(this);
        this.connect = this.connect.bind(this);

        this.state = {
            users: [],
            messages: [],
            clientId: getClientId(),
            isConnected: false,
        };
    }

    connect(username) {
        this.setState({ username });

        this.client = new RealtimeClient(this.state.clientId, username);

        this.client.connect()
            .then(() => {
                this.setState({ isConnected: true });
                this.client.onMessageReceived((topic, message) => {
                    if (topic === "client-connected") {
                        this.setState({ users: [...this.state.users, message] })
                    } else if (topic === "client-disconnected") {
                        this.setState({ users: this.state.users.filter(user => user.clientId !== message.clientId) })
                    } else {
                        this.setState({ messages: [...this.state.messages, message] });
                    }
                })
            })
    }

    onSend(message) {
        this.client.sendMessage({
            username: this.state.username,
            message: message,
            id: getMessageId(),
        });
    };

    render() {
        return (
            <div>
                <ChatHeader
                    isConnected={ this.state.isConnected }
                />
                <ChatWindow
                    users={ this.state.users }
                    messages={ this.state.messages }
                    onSend={ this.onSend }
                />
                <UserNamePrompt
                    onPickUsername={ this.connect }
                />
            </div>
        );
    }
}

export default App;
