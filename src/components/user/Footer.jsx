import React from 'react'

function Footer() {
  return (
<>

<div className="footer-are">
        <div className="container">
            <div className="extras row">
                <div className="col-md-12">
                    <div className="bodar"></div>
                </div>
                <div className="col-md-6">
                    <div className="footer-text">
                        <p>Copyright © <span id="current-year"></span> NirmalX</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="footer-menu">
                        <ul>
                            <li><a href="#"><i className="fab fa-telegram-plane"></i></a></li>
                            <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                            <li><a href="#"><i className="fab fa-medium"></i></a></li>
                            <li><a href="3.html"><i className="fab fa-facebook"></i></a></li>
                        </ul>
                    </div> 
                </div>
            </div>
        </div>
    </div>
</>
  )
}

export default Footer