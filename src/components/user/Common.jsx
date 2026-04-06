import React from 'react'

function Common() {
  return (
   <>
          <div className="fixed-bg"></div>
    <div className="loader-container main_loader " style={{display:"none",height:"100%",width:"100%"}}>
        <div className="loader"></div>
        <p className="loader-text">Please Wait...</p>
    </div>

    {/* <input name="userid" id="userid" type="HIDDEN" value=""/>
    <input name="baseurl" id="baseurl" type="HIDDEN" value="https://nirmalx.io/"/> */}
   </>
  )
}

export default Common