import React from 'react';
import {TextInput, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import {vibrate} from './utils';

var pomodoroSetting = 5
var breakSetting = 3


export default class App extends React.Component {
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
      timerStatus: "Stopped"
    }
  }

  mmssStringfromSeconds(input_seconds) {
    let d = new Date(null)
    d.setSeconds(input_seconds)
    return d.toISOString().substr(14,5) // get 5 digits from the 14th index position
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
    
    // this.displayTimer = setTimeout(()=> this.decrementSeconds(),pomodoroSetting*1000)
    
    this.setState(  {
      displayTimer: this.displayTimer,
      displayMmSs: this.mmssStringfromSeconds(this.state.countdownTimeSeconds),
    })
  }

  decrementSeconds = () => {
    // if either pomodoro or break time === 0 
    if(this.state.countdownTimeSeconds===0)  {
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

    // neither timer has finished so we decrement 1 second
    else  {
      this.setState(
        prevState => ({
        countdownTimeSeconds: prevState.countdownTimeSeconds - 1, // minus by 1 sec
        displayMmSs: this.mmssStringfromSeconds(prevState.countdownTimeSeconds-1),
       })
      )

      // debug
      console.log("countdownTimeSeconds | displayMmSs")
      console.log( this.state.countdownTimeSeconds, this.state.displayMmSs)
      console.log("-----------------------------------")
    }

    //show text alert for current timer status
    if (this.state.pomodoroRunning) {
      this.setState({
        timerStatus: "Work timer running",
      }
      )
    }
    else  {
      this.setState({
        timerStatus: "Currently on a break",
      }
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
        timerStatus: "Paused",
      })
      clearInterval(this.state.displayTimer)
      this.startTimer()
    }
    else  {
      clearInterval(this.state.displayTimer)
      this.setState({
        paused: !(this.state.paused),
        timerStatus: "Paused",
      })
    }
  }
  
  stopTimer = () => {
    clearInterval(this.state.displayTimer)
    this.setState({
      // make timer restart the pomodoro loop
      countdownTimeSeconds:pomodoroSetting,
      displayMmSs: this.mmssStringfromSeconds(0),
      pomodoroRunning: false,
      breakRunning: false,
      timerStatus:"Stopped"
    })
  }
  render(){
    return (
      <View style={styles.container}>

        <Settings />
        
        <Timer 
          timerStatusProp = {this.state.timerStatus}
          displayProp = {this.state.displayMmSs}
        />

        <Buttons
        startTimerProp = {this.startTimer}
        pauseTimerProp = {this.pauseTimer}
        stopTimerProp = {this.stopTimer}
        />
         
      </View>
    )
  }
}

// class Settings extends React.Component  {
//   constructor() {
//     super()
//     this.state = {
//       pSetting: 5,
//       bSetting: 3,
//     }
//   }
//   render()  {
//     return  (
//       <View style = {styles.settings}>
//         <Text>Pomodoro Setting</Text>
//         <TextInput 
//         onChangeText = { 
//           text => this.setState({
//             pSetting: text,
//           })
//         }
//         value = {this.state.pSetting}
//         />
//         <Text>Break Setting</Text>
//         <TextInput 
//         onChangeText = { 
//           text => this.setState({
//             bSetting: text,
//           })
//         }
//         value = {this.state.bSetting}
//         />

//       </View>
//     )
//   }
// }

const Buttons = props => (
  <View style = {styles.buttonContainer}>
    <TouchableOpacity onPress = {props.startTimerProp} style = {styles.buttonStyle} >
      <Text style = {styles.buttonText}>Start</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress = {props.pauseTimerProp} style = {styles.buttonStyle} >
      <Text style = {styles.buttonText}>Pause</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress = {props.stopTimerProp} style = {styles.buttonStyle} >
      <Text style = {styles.buttonText}>Stop</Text>
    </TouchableOpacity>
  </View>
)

const Timer = props => (
  <View>
    <Text style = {styles.timerStatus}> {props.timerStatusProp} </Text>
    <View style = {styles.timerContainer}> 
      <Text style = {styles.timerText}> {props.displayProp}</Text>  
    </View>
  </View>

)

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

  settings:
  {

  },

  buttonContainer:
  {
    marginTop:40,
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
    fontSize:110,
    // color: '#ffffff',
    textAlign: 'center'
  },
  timerStatus: {
    fontSize:30,
    color: 'tomato',
    textAlign: 'center',
    marginTop: 20,
    fontWeight:'bold',
  },
});
