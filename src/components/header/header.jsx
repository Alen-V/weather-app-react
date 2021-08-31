import { React, useState } from 'react'
import "./header.css";

const Header = (props) => {
    const { pages, numOfPages, pageActive, listData, days, width } = props
    const [dropdown, setDropdown] = useState(false)
    let setPage = (index) => {
      if(props.setPage) {
        toggleDropdownMenu()
        props.setPage(index)
      }
    }

    const toggleDropdownMenu = () => {
      setDropdown(!dropdown)
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
    const searchContainer = (
      <div className="search-container">
        <form onKeyDown={(e) => {getCityInfo(e)}}>
          <input type="search" placeholder="Search City"></input>
        </form>
      </div>
  )
        
    const navbarContainerLeft = (
        <div className="navbar-container-left">
          <div className="navbar-logo">
            <span>A-CODE Weather</span>
            {width > 992 ? null : <div className={`dropdown-btn ${dropdown ? 'expanded' : ""}`} onClick={() => toggleDropdownMenu()}>
              {<i class="fas fa-caret-down"></i>}
            </div>}
          </div>
            {width > 992 ?
              <div className="navbar-items">
                {items}
              </div> :
              <div className={`nav-dropdown-menu ${dropdown ? 'expanded' : ""}`}>
                {searchContainer}
                {items}
              </div>}
        </div>
    )
    
    const navbarContainer = (
        <div className="navbar-container">
            {navbarContainerLeft}
            {width > 992 ? searchContainer : null}
        </div>
    )
    return  <div className="navbar">
                {navbarContainer}
            </div>
}

export default Header;