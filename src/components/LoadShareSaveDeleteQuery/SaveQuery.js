import React from 'react';
import Component from 'react-component-component';
import { injectState } from 'freactal';
import { Route } from 'react-router-dom';
import urlJoin from 'url-join';
import Spinner from 'react-spinkit';
import SaveIcon from 'react-icons/lib/fa/floppy-o';

import Tooltip from 'uikit/Tooltip';
import { H3 } from 'uikit/Headings';
import { WhiteButton } from 'uikit/Button';
import { ModalFooter } from 'components/Modal';
import { arrangerApiRoot } from 'common/injectGlobals';
import sqonToName from 'common/sqonToName';
import shortenApi from './shortenApi';

import { trackUserInteraction, TRACKING_EVENTS } from '../../services/analyticsTracking';

import { niceWhiteButton } from 'theme/tempTheme.module.css';
import './LoadShareSaveDeleteQuery.css';

export default injectState(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        link: null,
        loading: false,
        queryName: sqonToName({ filters: this.props.sqon }),
        open: false,
      };
    }

    componentDidUpdate(prevProps) {
      if (prevProps.sqon !== this.props.sqon) {
        this.setState({ queryName: sqonToName({ filters: this.props.sqon }) });
      }
    }

    save = () => {
      let {
        stats,
        sqon,
        api,
        state: { loggedInUser },
      } = this.props;
      this.setState({ loading: true });
      shortenApi({
        stats,
        sqon,
        queryName: this.state.queryName,
        loggedInUser,
        api,
        sharedPublicly: false,
      })
        .then(data => {
          this.setState({
            loading: false,
            link: urlJoin(arrangerApiRoot, 's', data.id),
          });
          const trackingSqon = { ...sqon, id: data.id };
          let savedQueryInteraction = {
            category: TRACKING_EVENTS.categories.fileRepo.dataTable,
            action: TRACKING_EVENTS.actions.query.save,
            label: JSON.stringify(trackingSqon),
          };
          trackUserInteraction(savedQueryInteraction);
        })
        .catch(error => {
          this.setState({ error: true, loading: false });
          trackUserInteraction({
            category: TRACKING_EVENTS.categories.fileRepo.dataTable,
            action: TRACKING_EVENTS.actions.query.save + ' FAILED',
          });
        });
    };

    render() {
      const { disabled } = this.props;
      return (
        !!this.props.state.loggedInUser && (
          <WhiteButton
            disabled={disabled}
            onClick={() =>
              !disabled &&
              this.setState({ open: true }, () => {
                // so hacky, but couldn't get any reasonable approach to work
                let id = setInterval(() => {
                  if (this.input) {
                    this.input.focus();
                    clearInterval(id);
                  }
                });
              })
            }
          >
            <Route>
              {({ history }) => (
                <Tooltip
                  position="bottom"
                  onRequestClose={() => {
                    this.setState({ open: false, link: null });
                  }}
                  interactive
                  open={this.state.open}
                  html={
                    <Component
                      initialState={{ saved: false }}
                      className="saveQuery-tooltip-container"
                      render={({ state, setState }) => (
                        <div className="saveQuery-tooltip-content">
                          <div
                            className={`saveQuery-tooltip-confirmation ${
                              state.saved && this.state.link ? 'saved' : ''
                            }`}
                          >
                            <div className="textWrapper">Query saved succesfully!</div>
                            <div
                              onClick={() => {
                                trackUserInteraction({
                                  category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                  action: 'View in My Saved Queries',
                                });
                                history.push('/dashboard');
                              }}
                            >
                              <button className={niceWhiteButton}>View in My Saved Queries</button>
                            </div>
                          </div>
                          <H3 className="saveQuery-heading">
                            Save Query
                            {this.state.loading && (
                              <Spinner
                                fadeIn="none"
                                name="circle"
                                color="purple"
                                style={{
                                  width: 15,
                                  height: 15,
                                  marginRight: 9,
                                  marginLeft: 'auto',
                                }}
                              />
                            )}
                          </H3>
                          <div className="someText1">Save the current configuration of filters</div>
                          <div className="someText2">Enter a name for your saved query:</div>
                          <div style={{ marginBottom: '85px' }}>
                            <input
                              className="someText3"
                              type="text"
                              value={this.state.queryName}
                              ref={input => {
                                this.input = input;
                              }}
                              onChange={e => this.setState({ queryName: e.target.value })}
                            />
                          </div>
                          <ModalFooter
                            handleSubmit={() => setState({ saved: true }, this.save)}
                            handleCancelClick={() => this.setState({ open: false })}
                          />
                        </div>
                      )}
                    />
                  }
                >
                  <SaveIcon />
                  &nbsp;Save
                </Tooltip>
              )}
            </Route>
          </WhiteButton>
        )
      );
    }
  },
);
