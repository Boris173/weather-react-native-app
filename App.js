import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser'; 


var city_defoult = null;
const appid = '58752f3beb57d09b5cfadbd503e6e45e';



class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      date: new Date(), 
      update: this._update,
      timer: null,

      //main
      current_weather:null,
      days5_weather:null,

      //additional
      current_weather_sys:null,
      current_weather_weather:null,
      current_datatime:null

    }
  }



  //current weather data - use geolocation
getWeatherOnGeo(lat, lon) {
  axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}`)    
  .then(res=>{
      this.setState({
        current_weather:res.data,
        current_weather_sys:res.data.sys,
        current_weather_weather:res.data.weather,
        current_datatime:res.data.dt
      });  
  })
  .catch(err=>console.log(err))
}



  getWeather(){
    //current weather data - use geolocation-----------------------
    navigator.geolocation.getCurrentPosition(
      position => { 
        this.getWeatherOnGeo(position.coords.latitude,  
          position.coords.longitude);
        },
        error => {
          console.log(error);
          city_defoult = 'Димитровград';
          if (city_defoult != null) {
            //current weather data - use city_defoult----------------------
            axios.get('http://api.openweathermap.org/data/2.5/weather?q='+city_defoult+'&appid='+appid)
            .then(res=>{
                this.setState({
                  current_weather:res.data,
                  current_weather_sys:res.data.sys,
                  current_weather_weather:res.data.weather,
                  current_datatime:res.data.dt
                });  
            })
            .catch(err=>console.log(err));
            }
        }
    );
  }    



  convert(){
    let unixtimestamp = this.state.current_datatime;
    let months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let date = new Date((unixtimestamp*1000));
    let year = date.getFullYear();
    let month = months_arr[date.getMonth()];
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    //let seconds = "0" + date.getSeconds();
    let convdataTime = day+'-'+month+'-'+year+' '+hours + ':' + minutes.substr(-2);
    
    return ReactHtmlParser(convdataTime);      
   }



   _update(){
    this.setState({ date: new Date().toLocaleTimeString() });    
    this.getWeather();       
    this.convert();      
   }



   componentDidMount(){     
    this.getWeather();   
    this.setState({ timer: setInterval(() => this._update(), 50000) })
  }



  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
 


  get_icon(res_weather){
    let icon_w = res_weather;
    let icon_rez;
    if(icon_w != null){
        icon_rez = icon_w.map(function(name_icon) {
          return ('<img src="https://openweathermap.org/img/wn/'+name_icon.icon+'@2x.png" alt="Imgs" />')
        });  
    } else return null

    return ReactHtmlParser(icon_rez); 
  }    



  /* days5_weather_listevent(id_event){
    let array_event = this.state.days5_weather.list;
    let array_rez;
    if(array_event != null){
      array_rez = array_event.map(function(array_event, index){
        if (index === id_event) {

          //block_processing array weather
            let array_w = array_event.weather;
            //let array_w_icon;
            let array_w_description;
            let array_map;
            if(array_w != null){
              array_map = array_w.map(function(pars) {
                //array_w_icon = pars.icon;
                array_w_description =  pars.description;
                return ReactHtmlParser('<img src="https://openweathermap.org/img/wn/'+pars.icon+'@2x.png" alt="Imgs" />')
            })
            } else return null

          //block processing dt            
            let date0 = array_event.dt_txt.split(' ',10); 
            let date1 = date0[0];          
            let date2 = date0[1];  
          return (
            <View>
                <Text style={styles.title}>
                {date1}
                <br/>
                {date2}
                </Text>  

                <View className="icon_and_time">
                  <span>{array_map}</span>
                  <Text style={styles.title}><h3>{(array_event.main.temp - 273.15).toFixed(0)} &#8451;</h3></Text>
                </View>

                <Text style={styles.title}>
                  Feels like {(array_event.main.feels_like- 273.15).toFixed(0)} &#8451;
                  </Text>   
                                
                <Text style={styles.title}>{array_w_description}</Text>                  
                <Text style={styles.title}>speed wind {array_event.wind.speed} </Text>  
                <Text style={styles.title}>humidity {array_event.main.humidity} %</Text>       

            </View>
          )
        }else return null
      }
      )

    } else return null

    return array_rez; 
  } */


  render() {
    const { /* days5_weather, */ current_weather, current_weather_sys, current_weather_weather } = this.state;
      
    //if (days5_weather != null) { 
      if (current_weather != null) {
      return (
        <View className="Apps" style={styles.apps}>   
            <View className="block1" style={styles.block1} >
            
                <View>
                <Text style={styles.title}>{current_weather.name}, {current_weather_sys.country}</Text>
                </View>

                <View>
                <Text style={styles.title}>{this.convert()} </Text>
                </View> 

                <View className="icon_and_time" style={styles.icon_and_time}>
                  {/* <Image 
                    style={{width:'100px', height:'100px'}}
                    source={{uri:"https://openweathermap.org/img/wn/"+{current_weather_weather}+"@2x.png"}}
                  /> */}
                  <View>
                    {this.get_icon(current_weather_weather)}               
                  </View>
                  <View>
                    <Text style={styles.titleMain}>{(current_weather.main.temp - 273.15).toFixed(0)} &#8451;</Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.title}>Feels like {(current_weather.main.feels_like - 273.15).toFixed(0)} &#8451;</Text>
                </View>       
            


           {/*  <View className="block2" style={styles.block2}> */}
             
           {/*  <Container>
              <Row>
             
              
              <Col sm>
                {this.days5_weather_listevent(2)}
              </Col> 

              <Col sm>
                {this.days5_weather_listevent(3)}
              </Col> 

              <Col sm>
                {this.days5_weather_listevent(4)}
              </Col> 

              <Col sm>
                {this.days5_weather_listevent(5)}
              </Col> 

              <Col sm>
                {this.days5_weather_listevent(6)}
              </Col>  
            

              <Col> 
              <View className="cols d-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(2)}
              </View>
              </Col> 

              <Col> 
              <View className="cols d-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(3)}
              </View>
              </Col> 

              <Col> 
              <View className="cols d-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(4)}
              </View>
              </Col> 

              <Col> 
              <View className="cols d-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(5)}
              </View>
              </Col> 

              <Col> 
              <View className="cols d-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(6)}
              </View>
              </Col>  
 */}
              
             {/*  <View className="cols d-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(2)}
              </View>
              <View className="cols d-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(3)}
              </View>
              <View className="cols d-none d-sm-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(4)}
              </View>
              <View className="cols d-none d-lg-block d-xl-block mar15" style={styles.mar15}>
                {this.days5_weather_listevent(5)}
              </View>
              <View className="cols d-none d-xl-block" style={styles.mar15}>
                {this.days5_weather_listevent(6)}
              </View>   */}

              {/* Columns are always 50% wide, on mobile and desktop */}
              

              {/* </Row>
              </Container>  */}
           {/*  </View>   */}
            
 
          </View>       
          </View>  

      )
    }
    else {
      return (
        <p></p>
      )
    }
   
  } 
  
  }
  


const styles = StyleSheet.create({  
  title: {
    fontSize: 25,
    alignItems: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  titleMain: {
    fontSize: 40,
    alignItems: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  apps: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
    textAlign: 'center',
  },
  
  block2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  mar15: {
    marginRight: '15px',
  },

  icon_and_time:{  
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default App;