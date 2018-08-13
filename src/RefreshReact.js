import React, { Component } from 'react';
import Classnames from 'classnames';
import refresh from './refresh';

class RefreshReact extends Component {
  state = {
    status: '',
  };
  static defaultProps = {
    onRefresh: () => {},
    loading: false,
    indicator: {
      up: () => '加载中...',
      down: (status) => {
        switch (status) {
          case 'deactivate':
            return '下拉刷新';
          case 'activate':
            return '释放加载';
          case 'release':
            return 'loading';
          case 'finish':
            return '加载完成';
        }
      },
    },
    disable: false,
    lock: false,
    loadFull: {
      enable: false,
    },
    direction: 'up',
    autoLoading: false,
  };
  refresh;
  container = React.createRef();

  onRefresh = () => {
    return this.props.onRefresh();
  };

  refreshInit = () => {
    const { direction, loadFull, autoLoading } = this.props;
    this.refresh = refresh(this.container.current, {
      direction,
      callback: this.onRefresh,
      loadFull,
      statusChange: (status) => {
        this.setState({
          status,
        });
      },
      autoLoading,
    });
    this.refresh.init();
  };

  componentDidUpdate(prevProps) {
    if (this.props.disable !== prevProps.disable) {
      if (!this.props.disable) {
        this.refreshInit();
      } else {
        this.refresh.destory();
      }
    }
    if (this.props.lock !== prevProps.lock) {
      this.refresh.lockScroll(this.props.lock);
    }

    if (this.props.loading !== prevProps.loading) {
      if (this.props.loading) {
        this.refresh.showLoading();
      } else {
        this.refresh.endSuccess();
      }
    }
  }

  componentDidMount() {
    if (!this.props.disable) {
      this.refreshInit();
    }
  }
  componentWillUnmount() {
    this.refresh && this.refresh.destory();
  }

  resetScroll = () => {
    this.refresh.resetScroll();
  };
  render() {
    const { className, indicator, direction } = this.props;
    const cls = Classnames(className, 'godz-hardware');

    const isUp = direction === 'both' || direction === 'up';
    const isDown = direction === 'both' || direction === 'down';

    return (
      <div className={cls} ref={this.container}>
        {isDown && (
          <div className="godz-pr-down">
            <div className="godz-pr-indicator">
              <div className="godz-pr-box">
                <div className="godz-pr-text">{indicator.down(this.state.status)}</div>
              </div>
            </div>
          </div>
        )}
        {this.props.children}
        {isUp && (
          <div className="godz-pr-up">
            <div className="godz-pr-box">
              <div className="godz-pr-text">{indicator.up()}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RefreshReact;
