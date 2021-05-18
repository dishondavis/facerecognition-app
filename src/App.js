import React, { Component } from 'react'
import FaceRecognition from "./components/FaceRecognition/faceRecognition";
import Navigation from "./components/Navigation/navigation";
import SignIn from "./components/SignIn/signIn";
import Logo from "./components/Logo/logo.js";
import ImageLinkForm from "./components/ImageLinkForm/imageLinkForm.js";
import Rank from "./components/Rank/rank.js";
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from "clarifai"; 


const app = new Clarifai.App({
  apiKey: 'ae0eb3d9952049429d227506b9ed3dfd'
})

const particlesOptions ={
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 550,
          line_linked:
          {enable:true,
          distance:150,
          // events:{
          //   onhover:
          //     {enable:true,
          //       mode:'repulse'},  
        }
      }
    }
  }
}


class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route:'signin'
    }
  }

  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
   const image = document.getElementById('inputimage')
   const width = Number(image.width);
   const height = Number(image.height);
  return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
    
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})
    app.models
      .predict( 
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response))) 
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
             <Particles className="particles"
                params={particlesOptions}
              />
        <Navigation onRouteChange={this.onRouteChange} />
        { this.state.route === 'signin' 
        ? <SignIn onRouteChange={this.onRouteChange} />
        : <div> 
        <Logo />
       <Rank />
       <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
       <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
       </div>
        }
      </div>
    );
  }
  }
  

export default App;
