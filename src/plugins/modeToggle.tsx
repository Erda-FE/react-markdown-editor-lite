import * as React from 'react';
import i18n from 'src/i18n';
import { PluginComponent } from './Plugin';

interface ModeToggleState {
  view: {
    html: boolean;
    md: boolean;
  };
}

export default class ModeToggle extends PluginComponent<ModeToggleState> {
  static pluginName = 'mode-toggle';
  static align = 'left';

  private get isDisplay() {
    if (this.editorConfig.canView) {
      return this.editorConfig.canView.html && this.editorConfig.canView.md;
    }
    return false;
  }

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      view: this.editor.getView(),
    };
  }

  private handleClick(key: 'edit' | 'preview') {
    let { html, md } = this.state.view;
    if (this.editorConfig.canView?.mdWithHtml) {
      switch (key) {
        case 'edit':
          md = html ? !md : true; // 必须有一个为 true
          break;
        case 'preview':
          html = md ? !html : true;
          break;
      }
    } else {
      html = key === 'preview';
      md = key === 'edit';
    }
    const nextView = { html, md };

    this.setState({ view: nextView });
    this.editor.setView(nextView);
  }

  private handleChange(view: { html: boolean; md: boolean }) {
    this.setState({ view });
  }

  componentDidMount() {
    this.editor.on('viewchange', this.handleChange);
  }

  componentWillUnmount() {
    this.editor.off('viewchange', this.handleChange);
  }

  render() {
    if (this.isDisplay) {
      const { html, md } = this.state.view;
      return (
        <span>
          <span
            className={`button mode-button ${md ? 'active-button' : ''}`}
            title={i18n.get('btnModeEditor')}
            onClick={() => this.handleClick('edit')}
          >
            {i18n.get('Edit')}
          </span>
          <span
            className={`button mode-button ${html ? 'active-button' : ''}`}
            title={i18n.get('btnModePreview')}
            onClick={() => this.handleClick('preview')}
          >
            {i18n.get('Preview')}
          </span>
        </span>
      );
    } else {
      return null;
    }
  }
}
