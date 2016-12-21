
/*
class HelloMessage extends React.Componet{
    super();
    render(){
        return <div>Hello {this.props.name}</div>
    };
}

ReactDOM.render(
    <HelloMessage name="fqj"/>,
    document.getElementById("index")
);
*/

var LikeButton = React.createClass({
    //组件中只执行一次 设置属性props 相当于静态方法
    getDefaultProps:function(){
        return {
            testP:"fwe",
            id:0
        }
    },
    //每个实例中执行一次 设置状态变量state 相当于构造函数
    getInitialState:function(){
        return {liked:false};
    },
    handleClick:function(){
        this.setState({liked:!this.state.liked});
    },
    propTypes:{
        id:React.PropTypes.number.isRequired,
        testP:React.PropTypes.string.isRequired,
        onClick:React.PropTypes.func
    },
    render:function () {
        var text = this.state.liked?'like':'haven\'t liked';
        return (
            <p key={this.props.key} onClick={this.handleClick}>
                You {this.props.testP} {this.props.id} {text} this. Click to toggle.
            </p>
        );
    }
});
var uniqueID = "tID";
ReactDOM.render(
    <LikeButton key={uniqueID}/>,
    document.getElementById('index')
)