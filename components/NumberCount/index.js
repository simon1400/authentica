import handleViewport from 'react-in-viewport';
import CountUp from 'react-countup';
import { useState } from 'react';

const NumberCount = handleViewport(({ inViewport, forwardedRef, startCount, setStartCount, data }) => {

  if(inViewport){
    setStartCount(true)
  }

  return (
    <div className="uk-grid uk-child-width-1-1 uk-child-width-auto@s" uk-parallax="x: 40vw, -100vw; media: @s" uk-grid="" ref={forwardedRef}>
      {data?.length && data.map((item, index) => <div key={index} className="numer-item">
        {startCount && <CountUp
          start={0}
          end={parseInt(item.number)}
          duration={4}
          useEasing={true}
          useGrouping={true}
          // redraw={true}
        />}
        <p>{item.title}</p>
      </div>)}
    </div>
  )
})

export default NumberCount