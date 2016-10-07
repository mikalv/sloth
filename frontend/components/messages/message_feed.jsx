import React from 'react';
import Message from './message';
import MessageForm from './message_form';

class MessageFeed extends React.Component {
  constructor(props) {
    super(props);

    this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
    this.channel = this.channel.bind(this);
    console.log(this.props);
  }

  handleUnsubscribe() {
    this.props.unsubscribeFromChannel(
      this.props.channel.id
    );
  }

  channel() {
    if (this.props.channel) {
      return this.props.channel;
    } else if (this.props.allChannels[this.props.params.channelId]) {
      return(
        this.props.allChannels[this.props.params.channelId]
      );
    }
  }

  render() {
    if (this.channel()) {
      const thisChannel = this.channel();

      const messages = [];
      if (this.props.messages) {
        for (let id in this.props.messages[thisChannel.id]) {
          messages.push(
            <Message
              key={id}
              message={this.props.messages[thisChannel.id][id]} />
          );
        }
      }

      return(
        <section className="message-feed">
          <header>
            <h2>{thisChannel.name}</h2>
            <small>
              {thisChannel.members.length} members | {thisChannel.purpose}
            </small>
            <button
              className="leave-channel-button"
              onClick={this.handleUnsubscribe}>Leave this channel</button>
          </header>
          <ul className="message-feed-main">
            {messages}
          </ul>
          <MessageForm
            channelId={thisChannel.id}
            createMessage={this.props.createMessage} />
        </section>
      );
    } else {
      return <section className="message-feed"></section>;
    }
  }
}

export default MessageFeed;
