import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import {vibrate} from './utils';

var pomodoroSetting = 5
var breakSetting = 3


class Timer extends React.Component {
  constructor(props)  {
    super(props)  
    this.state = {
      timeDisplayMM: 25,
      countdownTimeSeconds: pomodoroSetting, // start with 5 seconds
      pomodoroRunning: false,
      breakRunning: false,
      displayTimer: null,
      breakCounter: null,
      displayMmSs: null,
      screenBlank:true,
      paused: false,
    }
  }

  mmssStringfromSeconds(input_seconds) {
    let d = new Date(null)
    d.setSeconds(input_seconds)
    return d.toISOString().substr(14,5) 
  }

  componentWillMount()  {
    if(this.state.screenBlank)  {
      this.setState({
        screenBlank:false, 
        displayMmSs: this.mmssStringfromSeconds(this.state.countdownTimeSeconds)
      })
    }
  }
  
  startTimer = () => {
    if (!(this.state.pomodoroRunning || this.state.breakRunning)) this.setState({pomodoroRunning:true})
    
    if (this.state.displayTimer) clearInterval(this.state.displayTimer)

    
    this.displayTimer = setInterval(()=>{this.decrementSeconds()}, 1000)
    
    this.setState(  {
      displayTimer: this.displayTimer,
      displayMmSs: this.mmssStringfromSeconds(this.state.countdownTimeSeconds),
    })
  }

  decrementSeconds = () => {
    if(this.state.countdownTimeSeconds<0)  {
      // Pomodoro has finished
      if (this.state.pomodoroRunning) {
        this.setState({
          pomodoroRunning: false,
          breakRunning: true,
          countdownTimeSeconds: breakSetting,
        })
      }

      // break has finished 
      else if (this.state.breakRunning) {
        this.setState({
          pomodoroRunning: true,
          breakRunning:false,
          countdownTimeSeconds: pomodoroSetting,
        })
      }
      this.switchTimer()
    }

    // decrementSeconds
    else  {
      this.setState(
        prevState => ({
        countdownTimeSeconds: prevState.countdownTimeSeconds - 1, // minus by 1 sec
        displayMmSs: this.mmssStringfromSeconds(this.state.countdownTimeSeconds),
       })
      )
    }
  }

  switchTimer = () =>  {
    //break timer will start now
    if (this.state.breakRunning)  {
      console.log("break will start now. seconds: ",  this.state.countdownTimeSeconds )
    }
    else if (this.state.pomodoroRunning) {
      console.log("pomodoro will start now. seconds: ",  this.state.countdownTimeSeconds )
    }
    

    //switch timers
    clearInterval(this.state.displayTimer)
    this.startTimer()
  }

  pauseTimer = () => {
    if (this.state.paused)  {
      this.setState({
        paused: !(this.state.paused),
      })
      clearInterval(this.state.displayTimer)
      this.startTimer()
    }
    else  {
      clearInterval(this.state.displayTimer)
      this.setState({
        paused: !(this.state.paused),
      })
    }
  }
  
  stopTimer = () => {
    clearInterval(this.state.displayTimer)
    this.setState({
      countdownTimeSeconds:0,
      displayMmSs: this.mmssStringfromSeconds(0),
    })
  }
  render(){
    return (
      <View style={styles.container}>
        <View style = {styles.timerContainer}> 
          <Text style = {styles.timerText}> {this.state.displayMmSs}</Text>  
        </View>
         <View style = {{marginTop:25,}}>
          <TouchableOpacity onPress = {this.startTimer} style = {styles.buttonStyle} >
            <Text style = {styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress = {this.pauseTimer} style = {styles.buttonStyle} >
            <Text style = {styles.buttonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress = {this.stopTimer} style = {styles.buttonStyle} >
            <Text style = {styles.buttonText}>Stop</Text>
          </TouchableOpacity>
         </View>
      </View>
    )
  }
}

export default class App extends React.Component {
  render() {
    return (
      <Timer />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    
    marginBottom:5,
    height: 60,
    width: 180,
    alignItems: 'center',
    padding: 5,
    justifyContent: 'center',
    backgroundColor: '#24a0ed',
    borderRadius:5
  },
  buttonText:
  {
    fontSize:30,
    color: '#ffffff',
    textAlign: 'center'
  },
  timerContainer: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',

  },
  timerText: {
    fontSize:90,
    // color: '#ffffff',
    textAlign: 'center'
  },
});
