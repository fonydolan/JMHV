var React = require('react');
var ReactDOM = require("react-dom");




/* Success 0
var $ = require('jquery');
$('body').html('Hello Webpack!');
 */

/* Success 1
    ReactDOM.render(
    <div name="Nate" >fjaiowjeiof</div>, 
    document.getElementById('content')
    );
 */

/* Success 2
    var HelloWorldBox = require("../component/HelloWorldBox.jsx");
    ReactDOM.render(<HelloWorldBox />,document.getElementById('content'));
 */

import Hello from "../component/HelloES6.jsx";
let rootNode = document.getElementById('content');
let name = "world test hello";
ReactDOM.render(<Hello username="1234567" />,rootNode);