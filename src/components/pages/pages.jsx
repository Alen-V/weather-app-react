import React from 'react'
import "./pages.css"

const Pages = (props) => {
    const { pages, pageActive, cityName, cityId, listData, days, dataUpdate, data, weatherDescription, currentTemp, measureUnit,sunrise, sunset } = props
    let counter = 0;
    let pageInfo = null
    let dayImage;
    let nightImage;
    const windImage = require(`../../assets/img/wind.svg`).default;
    const humidityImage = require(`../../assets/img/humidity.svg`).default;
    const sunriseImage = require(`../../assets/img/sunrise.jpg`).default;
    const sunsetImage = require(`../../assets/img/sunset.jpg`).default;
    let sunRise = new Date(sunrise * 1000)
    let sunSet = new Date(sunset * 1000)
    const sunriseEl = (
        <div className="sun-data sunrise">
            <img src={sunriseImage} alt=""/>
            <div className="info-container">
                <span>Sunrise</span>
                <span>
                    {sunRise.toString().split(' ')[4]}
                </span>
            </div>
        </div>
    )

    const sunsetEl = (
        <div className="sun-data sunset">
            <img src={sunsetImage} alt=""/>
            <div className="info-container">
                <span>Sunset</span>
                <span>
                    {sunSet.toString().split(' ')[4]}
                </span>
            </div>
        </div>
    )
    let statisticsCard = days.map((date, index) => {
        dayImage = require(`../../assets/img/day/${data[index][0][0].weather[0].description.replace(' ', '_')}.png`).default
        nightImage = require(`../../assets/img/night/${data[index][0][0].weather[0].description.replace(' ', '_')}.png`).default
        let cards = (
            <div className="card"
                key={index}
            >
                <div className="weather-description">
                    <img src={dayImage} alt=""/>
                    <span className="degrees">{Math.floor(data[index][0][0].temperature.currentTemp * 10) / 10}{measureUnit}</span>
                    <span className="weather-condition">{data[index][0][0].weather[0].description}</span>
                    <span>{date}</span>
                </div>
                <div className={index === 0 ? 'weather-extra-info active-info' : 'weather-extra-info'}>
                    <span>{cityName}</span>
                    <span><img src={windImage} alt=""/>{data[index][0][0].wind.windValue}{data[index][0][0].wind.measureUnit}</span>
                    <span><img src={humidityImage} alt=""/>{data[index][0][0].humidity.humidityValue}{data[index][0][0].humidity.measureUnit}</span>
                    {sunriseEl}
                    {sunsetEl}
                </div>
            </div>
        )
        return cards
    })

    let cards = (
        <div className="cards-information">
            <div className="card major-card control-card">
                {statisticsCard[0]}
            </div>
            <div className="minor-cards card-control">
                {statisticsCard.map((element, index) => {
                    return index !== 0 ? element : null
                })}
            </div>
        </div>
    )

    const hourMainCard = (
        <div className="current-weather">
            <span>Current Weather</span>
            <span className="city-name">{cityName}</span>
            <div className="current-weather-info active-info">
                <img src={dayImage} alt=""/>
                <span className="temp">{Math.floor(currentTemp * 10) / 10}{measureUnit}</span>
                <span>{weatherDescription}</span>
            </div>
        </div>
    )
    const minorCard = (count) => data.map((element, index) => {
        let header = element.map((head, indexEl) => {
            if( counter < count ) {
                let headerEl = indexEl === 0 ? (
                    <div className="card-header">
                        {days[index]}
                    </div>
                ) : null;
                
                let cardEl = (
                    <div className="hour-card">
                        <div className="temp-details">
                            <span className="hour">{head[0].hour}</span>
                            <div className="temp-container">
                                <span className="temp">{head[0].temperature.currentTemp}</span>
                                <span className="degrees">{head[0].temperature.measureUnit}</span>
                            </div>
                        </div>
                        <span className="description">
                            {<i class="fas fa-caret-down"></i>}
                        </span>
                    </div>          
                );
                    cardEl = indexEl === 0 ? (
                        <div className="data-list">
                            {headerEl}
                            {cardEl}
                        </div>
                    ) : (
                        <div className="data-list">
                            {cardEl}
                        </div>
                        )
                    counter++
                return cardEl
            } else  {
                return
            };
        })
        return header
    })

    switch (pageActive) {
        case 1:
            pageInfo = (
                cards
            )
            break;
        case 2: 
            pageInfo = (
                <div className="hour-cards">
                    <div className="left-side">
                        {hourMainCard}
                    </div>
                    <div className="right-side">
                        {minorCard(7)}
                    </div>
                </div>
            )
            break;
        case 3: 
            pageInfo = (
                <div className="data-cards">
                    {statisticsCard[0]}
                    {minorCard(40)}
                    <div className="shadow"></div>
                </div>
                )
            break;
        case 4: 
            pageInfo = (
                <div className="about-info">
                    <span>Nothing to see here!</span>
                </div>
            )
            break;
        default:
            
            break;
    }



    const pageContainer = pages.map((pageName, index) => (
        <div className={(index + 1) === pageActive ? `pages ${pageName}-page active-page` : `pages ${pageName}-page`}>
            {pageInfo}
        </div>
    ))
    return  <div className="page-container">
                {pageContainer}
            </div>
}

export default Pages