import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { injectState } from 'freactal';
import urlJoin from 'url-join';
import Spinner from 'react-spinkit';
import ShareIcon from 'react-icons/lib/fa/share-alt';
import ChainIcon from 'react-icons/lib/fa/chain';
import FBIcon from 'react-icons/lib/fa/facebook';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import LIIcon from 'react-icons/lib/fa/linkedin';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import Tooltip from 'uikit/Tooltip';
import { arrangerApiAbsolutePath } from 'common/injectGlobals';
import shortenApi from './shortenApi';
import { Trans } from 'react-i18next';

let Bubble = p => <span className={`bubble`} {...p} />;

let ItemRow = ({ styleClass = '', ...props }) => (
  <div className={`itemRow ${styleClass}`} {...props} />
);

export default compose(injectState, withTheme)(
  class extends React.Component {
    state = { link: null, copied: false, error: null };

    share = () => {
      let { stats, sqon, api, state: { loggedInUser } } = this.props;
      shortenApi({ stats, sqon, loggedInUser, api })
        .then(data => {
          this.setState({
            link: urlJoin(arrangerApiAbsolutePath, 's', data.id),
          });
        })
        .catch(error => {
          this.setState({ error: true });
        });
    };

    render() {
      const { className = '', theme } = this.props;
      return (
        <div className={`${theme.shareQuery()} ${className}`}>
          <div id="share" className="sqon-bubble sqon-clear" onClick={this.share}>
            <Tooltip
              position="bottom"
              trigger="click"
              onRequestClose={() =>
                // after fadeout transition finishes, clear copy state
                setTimeout(() => this.setState({ copied: false }), 1000)
              }
              interactive
              html={
                <div className={theme.shareQueryTooltipContent()}>
                  {!this.state.link ? (
                    <ItemRow styleClass={`errorMsg`}>
                      {this.state.error ? (
                        <Trans>Sorry something went wrong.</Trans>
                      ) : (
                        <Spinner
                          fadeIn="none"
                          name="circle"
                          color="purple"
                          style={{
                            width: 15,
                            height: 15,
                            marginRight: 9,
                          }}
                        />
                      )}
                    </ItemRow>
                  ) : (
                    <React.Fragment>
                      <ItemRow>
                        <CopyToClipboard
                          text={this.state.link}
                          onCopy={() => this.setState({ copied: true })}
                        >
                          <span>
                            <Bubble>
                              <ChainIcon />
                            </Bubble>
                            <span>
                              {this.state.copied ? (
                                <Trans>Copied!</Trans>
                              ) : (
                                <Trans>copy short URL</Trans>
                              )}
                            </span>
                          </span>
                        </CopyToClipboard>
                      </ItemRow>
                      <ItemRow>
                        <FacebookShareButton
                          url={this.state.link}
                          quote="Kids First File Repo Query"
                        >
                          <Bubble>
                            <FBIcon />
                          </Bubble>
                          <Trans>share on facebook</Trans>
                        </FacebookShareButton>
                      </ItemRow>
                      <ItemRow>
                        <Bubble>
                          <TwitterIcon />
                        </Bubble>
                        <TwitterShareButton
                          title="Kids First File Repo Query"
                          url={this.state.link}
                        >
                          <Trans>share on twitter</Trans>
                        </TwitterShareButton>
                      </ItemRow>
                      <ItemRow>
                        <LinkedinShareButton
                          title="Kids First File Repo Query"
                          url={this.state.link}
                        >
                          <Bubble>
                            <LIIcon />
                          </Bubble>
                          <Trans>share on linkedin</Trans>
                        </LinkedinShareButton>
                      </ItemRow>
                    </React.Fragment>
                  )}
                </div>
              }
            >
              <ShareIcon />&nbsp;<Trans>share</Trans>
            </Tooltip>
          </div>
        </div>
      );
    }
  },
);
