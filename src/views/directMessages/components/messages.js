// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { sortAndGroupMessages } from '../../../helpers/messages';
import ChatMessages from '../../../components/chatMessages';
import { displayLoadingState } from '../../../components/loading';
import Icon from '../../../components/icons';
import { HorizontalRule } from '../../../components/globals';
import { getDirectMessageThreadMessages } from '../queries';
import { toggleReactionMutation } from '../mutations';

class MessagesWithData extends Component {
  state: {
    subscribed: boolean,
  };

  constructor() {
    super();

    this.state = {
      subscribed: false,
    };
  }

  componentDidMount() {
    this.props.forceScrollToBottom();
    this.subscribe();
  }

  subscribe = () => {
    if (!this.props.loading && !this.state.subscribed) {
      this.setState({
        subscribed: true,
      });
      this.props.subscribeToNewMessages();
    }
  };

  componentDidUpdate(prev) {
    this.subscribe();
    const { contextualScrollToBottom, data } = this.props;

    // force scroll to bottom when a message is sent in the same thread
    if (prev.data.messages !== data.messages && contextualScrollToBottom) {
      contextualScrollToBottom();
    }
  }

  render() {
    const { data: { error, messages } } = this.props;

    if (error) {
      return <div>Error!</div>;
    }

    if (!messages) {
      return <div />;
    }

    const sortedMessages = sortAndGroupMessages(messages);

    return (
      <div style={{ width: '100%' }}>
        <div style={{ padding: '24px 0', background: '#fff' }}>
          <HorizontalRule>
            <hr />
            <Icon glyph="message" />
            <hr />
          </HorizontalRule>
        </div>
        <ChatMessages
          toggleReaction={this.props.toggleReaction}
          messages={sortedMessages}
          forceScrollToBottom={this.props.forceScrollToBottom}
          contextualScrollToBottom={this.props.contextualScrollToBottom}
          threadId={this.props.id}
          threadType={'directMessageThread'}
        />
      </div>
    );
  }
}

const Messages = compose(
  toggleReactionMutation,
  getDirectMessageThreadMessages,
  displayLoadingState
)(MessagesWithData);

export default Messages;