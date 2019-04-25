import React from 'react';
import FilesafeManager from "../lib/FilesafeManager"

export default class IntegrationsView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      integrations: FilesafeManager.get().filesafe.getAllIntegrations() || []
    };

    FilesafeManager.get().filesafe.addDataChangeObserver(() => {
      this.reloadIntegrations();
    })
  }

  reloadIntegrations() {
    let integrations = FilesafeManager.get().filesafe.getAllIntegrations();
    this.setState({integrations: integrations})
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.submitIntegrationCode();
    }
  }

  handleTextChange = (event) => {
    var text = event.target.value;
    this.setState({integrationCode: text});
  }

  submitIntegrationCode = () => {
    let code = this.state.integrationCode;
    if(!code || code.length == 0) {
      return;
    }

    FilesafeManager.get().filesafe.saveIntegrationFromCode(code);
    this.setState({integrationCode: null, showInputForm: false});
    this.reloadIntegrations();
  }

  addNewIntegrationClicked = () => {
    window.open(FilesafeManager.get().defaultRelayServerUrl(), "_blank");
    this.setState({showInputForm: true});
  }

  cancelIntegrationForm = () => {
    this.setState({showInputForm: false});
  }

  deleteIntegration = (integration) => {
    FilesafeManager.get().filesafe.deleteIntegration(integration);
  }

  setIntegrationAsDefaultUploadSource = (integration) => {
    FilesafeManager.get().filesafe.setIntegrationAsDefault(integration);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  displayStringForIntegration(integration) {
    var comps = integration.content.source.split("_");
    var result = "";
    for(var comp of comps) {
      result += this.capitalizeFirstLetter(comp) + " ";
    }
    return result;
  }

  render() {
    var hasMultipleIntegrations = this.state.integrations.length > 1;

    return (
      <div>
        <div className="sk-panel-row">
          <div className="sk-h3">Integrations ({this.state.integrations.length})</div>
          {!this.state.showInputForm &&
            <div className="sk-button info no-border" onClick={this.addNewIntegrationClicked}>
              <div className="sk-label">Add New</div>
            </div>
          }
        </div>

        <div id="integrations">
          {this.state.showInputForm &&
            <div className="sk-notification info">
              <strong>New Integration</strong>
              <p>A new tab has opened. After you complete the authentication flow, enter the code you receive below.</p>
              <input
                className="title sk-input contrast"
                type="text"
                placeholder={"Enter integration code"}
                value={this.state.integrationCode}
                onChange={this.handleTextChange}
                onKeyPress={this.handleKeyPress}
              />
              <div className="sk-button-group" style={{marginTop: 10}}>
                <div className="sk-button neutral" onClick={this.cancelIntegrationForm}>
                  <a className="">Cancel</a>
                </div>
                <div className="sk-button sk-base" onClick={this.submitIntegrationCode}>
                  <a className="sk-label">Submit</a>
                </div>
              </div>
            </div>
          }
        </div>

        <div>
          {this.state.integrations.map((integration) =>
            <div className="sk-panel-row">
              <div className="sk-horizontal-group">
                <div>
                  <span className={integration.content.isDefaultUploadSource ? "bold" : undefined}>{this.displayStringForIntegration(integration)}</span>
                  {integration.content.isDefaultUploadSource &&
                    <span> (Default)</span>
                  }
                </div>
                {hasMultipleIntegrations && !integration.content.isDefaultUploadSource &&
                  <a className="info" onClick={() => {this.setIntegrationAsDefaultUploadSource(integration)}}>Make Default</a>
                }
                <a className="danger" onClick={() => {this.deleteIntegration(integration)}}>Delete</a>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
