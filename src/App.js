import React, { Component } from "react"
import $ from 'jquery'
import logo from './logo.svg';
import './App.css';
import Header from './components/header/header.jsx'
import Pages from './components/pages/pages.jsx'

class HoursDataConstructor {
  constructor( date, hour, main, weather, wind, visibility ) {
      this.weather = {
        date: date,
        hour: hour,
        temperature: {
          currentTemp: main.temp,
          minTemp: main.temp_min,
          maxTemp: main.temp_max,
          measureUnit: '°C'
        },
        feelsLike: {
          feelValue: main.feels_like,
          measureUnit: 'Kelvin'
        },
        humidity: {
          humidityValue: main.humidity,
          measureUnit: '%'
        },
        pressure: {
          pressureValue: main.pressure,
          measureUnit: 'hPa'
        },
        wind: {
          windValue: wind.speed,
          measureUnit: 'm/s'
        },
        visibility: {
          visibilityValue: visibility
        },
        weather: weather
      };
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: ['statistics', 'cards', 'data', 'about'],
      numOfPages: 4,
      pageActive: 1,
      dataLoaded: false,
      cityData: {},
      data: [],
      listData: [],
      days: [],
      dataUpdate: [],
      dates: []
    }
  };
  setPage = (page) => {
    this.setState({
      pageActive: (page + 1)
    })
  }
  componentDidMount = async () => {
    try {
        await this.weatherDataCall('skopje')
        } catch(err) {
        console.log(err)
    }
  }

  weatherDataCall = (city) => {
    let currentTime = new Date()
    let daysTime = this.printDates(5)
    let listData, days, data;
    currentTime = currentTime.toString().split(' ')[4]
        try {
          this.setState({
            dataLoaded: false
          }, async () => {
            await this.fetchData(city)
            .then((dataX) => {
              listData = this.filterDays(dataX.list)
              days = this.eliminateDuplicates(listData)
              console.log(days)
              data = this.filterData(listData, days)
              this.setState({
                cityData: dataX.city,
                dataLoaded: true,
                listData: listData,
                days: days,
                data: data,
                dataUpdate: currentTime,
                dates: daysTime
              })
          })
          })
        } catch (err) {
          
        }
  }
  
  fetchData = async (city) => {
    let oldWeatherApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=814e138461b0f6b9423de687beb9ff3e`
    let newWeatherApi = `http://api.weatherapi.com/v1/forecast.json?key=e9ff8cb3a35840cfa1d103610211702&q&q=${city}&days=10`
    let call = await fetch(oldWeatherApi)
    let data = await call.json()
    console.log(data)
    return data
  }

  filterDays(days) {
    let listData = [];
    let date;
    let hour;
    let newDay
    for (let day of days) {
        date = `${day.dt_txt.split('-')[2].split(' ')[0]}.${day.dt_txt.split('-')[1].split(' ')[0]}`
        hour = `${day.dt_txt.split('-')[2].split(' ')[1].slice(0,5)}`
        newDay = new HoursDataConstructor(date, hour, day.main, day.weather, day.wind, day.visibility)
        listData.push(newDay)
    }
    return listData
  }
  eliminateDuplicates(array) {
    let i,
        length = array.length,
        outArray = [],
        object = [];
    for (i = 0; i < length; i++) {
        object[array[i].weather.date] = 0;
    }
    for (i in object) {
      outArray.push(i);
    }
    if(outArray.length > 5) outArray.pop()
    return outArray;
  }

  clearInput(input, secondInput){
    input.value = ``;
        if(secondInput === undefined){
            return
        }else{
            secondInput.innerHTML = ``
        }
  }

  printDates(limit) {
    let daysTime = []
    for (let i = 0; i < limit; i++) {
      let tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + i)
      tomorrow = tomorrow.toString().split(' ')[0]
      daysTime.push(tomorrow)
    }
    return daysTime
  }

  filterData(listData, filterDate) {
    console.log(filterDate)
    let filterStats = []
    let averageStats = []
    for (let i = 0; i < 5; i++) {
      listData.map((data) => {
        console.log(data)
          if(data.weather.date === filterDate[i]) {
              if(filterStats.length === i + 1) {
                filterStats[i].push([data.weather])
              } else {
                filterStats.push([[data.weather]])
              }
          }
      })
      if(i === 4) {
        console.log(filterStats)
          this.dailyStats(filterStats[1], averageStats, 'temperature','currentTemp')
          this.dailyStats(filterStats[1], averageStats, 'humidity','humidityValue')
          this.dailyStats(filterStats[1], averageStats, 'wind','windValue')
      }
  }
    return filterStats
  }
  dailyStats(statsFilter, array, object,stat) {
    let statsArray = []
    statsFilter.map((arrayFilter) => {
        let average = 0;
        arrayFilter.map((stats) => {
            average += stats[object][stat]
        })
        if ( object === 1 ){
            statsArray.push(Math.ceil([average / arrayFilter.length]))
        } else {
            statsArray.push(Math.round([average / arrayFilter.length]))
        }
    })
    array.push(statsArray)
}

render() {
  const {
    pages,
    numOfPages,
    pageActive,
    dataLoaded,
    cityData,
    data,
    listData,
    days,
    dataUpdate,
    dates,
  } = this.state;
  if(!dataLoaded) {
    return (
      <div>
        <span>Loading</span>
      </div>
    )
  } else {
    const content = (
      <div className="content">
        <Header
          pages={pages}
          numOfPages={numOfPages}
          pageActive={pageActive}
          listData={listData}
          days={days}
          setPage={this.setPage}
          dataCall={this.weatherDataCall}
        />
        <Pages
          pages={pages}
          numOfPages={numOfPages}
          pageActive={pageActive}
          cityId={cityData.id}
          cityName={cityData.name}
          sunrise={cityData.sunrise}
          sunset={cityData.sunset}
          currentTemp={listData[0].weather.temperature.currentTemp}
          measureUnit={listData[0].weather.temperature.measureUnit}
          weatherDescription={listData[0].weather.weather[0].description}
          data={data}
          listData={listData}
          days={days}
          dataUpdate={dataUpdate}
          dates={dates}
        />
      </div>
  )
  return content
  }
}
}

export default App;
