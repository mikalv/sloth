import React from 'react';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const message = this.state;

    this.props.createMessage({
      channelId: this.props.channelId,
      message,
    });
    this.setState({body: ''});
  }

  updateForm(e) {
    this.setState({body: e.currentTarget.value});
  }

  render() {
    return(
      <form className="message-form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          onChange={this.updateForm}
          value={this.state.body} />
        <input type="submit" className="message-form-submit" />
      </form>
    );
  }
}

export default MessageForm;
