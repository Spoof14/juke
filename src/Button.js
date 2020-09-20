import React, { PureComponent } from 'react'

export default class Button extends PureComponent {
    render() {
        return <button {...this.props} onClick={this.props.onClick} style={{padding: '1rem 2rem'}}>{this.props.children}</button>;
    }
}
