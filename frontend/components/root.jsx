import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import HomeContainer from './home/home_container';
import SignInFormContainer from './session_forms/signin_form_container';
import SignUpFormContainer from './session_forms/signup_form_container';
import ChannelsIndexContainer from './channels/channels_index_container';
import MessageFeedContainer from './messages/message_feed_container';
import { requestAllChannels,
         switchChannel,
         clearNotifications } from '../actions/channel_actions';
import { fetchCurrentMessages } from '../actions/message_actions';
import { fetchAllUsers } from '../actions/user_actions';

const Root = ({ store }) => {
  function redirectUnlessLoggedIn() {
    if (!store.getState().currentUser.id) {
      hashHistory.push('/signin');
    }
  }

  function setupFeed() {
    redirectUnlessLoggedIn();
    store.dispatch(requestAllChannels());
    store.dispatch(fetchAllUsers());
  }

  function changeCurrentChannel(nextState) {
    redirectUnlessLoggedIn();
    store.dispatch(clearNotifications(nextState.params.channelId));
    store.dispatch(switchChannel(nextState.params.channelId));
    store.dispatch(fetchCurrentMessages(nextState.params.channelId));
  }

  return (
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path="/" component={HomeContainer}>
          <Route path="signin" component={SignInFormContainer} />
          <Route path="signup" component={SignUpFormContainer} />
        </Route>
        <Route path="/messages" component={ChannelsIndexContainer} onEnter={setupFeed}>
          <Route path=":channelId" component={MessageFeedContainer} onEnter={changeCurrentChannel} />
        </Route>
      </Router>
    </Provider>
  );
};

export default Root;
