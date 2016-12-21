
import React from 'react'
//ES6
export default class Hello extends React.Component {
  /*
    static defaultProps = {
        autoPlay: false,
        maxLoops: 10,
    };  // 注意这里有分号
    static propTypes = {
        autoPlay: React.PropTypes.bool.isRequired,
        maxLoops: React.PropTypes.number.isRequired,
        posterFrameSrc: React.PropTypes.string.isRequired,
        videoSrc: React.PropTypes.string.isRequired,
    };  // 注意这里有分号
    state = {
        
    }
    */
    constructor (props) {
        super(props)
    }
    render() {
      return (
        <h1>Hello {this.props.username}!</h1>
      );
  }
}