import React from 'react'
import "./header.css";

const Header = (props) => {
    const { pages, numOfPages, pageActive, listData, days } = props

    let setPage = (index) => {
      if(props.setPage) {
        props.setPage(index)
      }
    }

    const getCityInfo = (event) => {
      if( event.keyCode === 13) {
        props.dataCall(event.target.value, days, listData)
      }
    }

    const items = pages.map((page, index) => (
      <div
      className={(index + 1) === pageActive ? 'navbar-item active-item' : 'navbar-item'}
      onClick={() => setPage(index)}
      key={index}
      >
        {page}
      </div>
    ))
        
    const navbarContainerLeft = (
        <div className="navbar-container-left">
          <div className="navbar-logo">
            <img src="/assets/img/Vector.svg" alt=""></img>
            <span>A-CODE Weather</span>
          </div>
            <div className="navbar-items">
              {items}
            </div>
        </div>
    )
    const searchContainer = (
        <div className="search-container">
          <form onKeyDown={(e) => {getCityInfo(e)}}>
            <input type="search" placeholder="Search City"></input>
          </form>
        </div>
    )
    const navbarContainer = (
        <div className="navbar-container">
            {navbarContainerLeft}
            {searchContainer}
        </div>
    )
    return  <div className="navbar">
                {navbarContainer}
            </div>
}

export default Header;