import React, { useContext } from 'react'
import { MyData } from './Context/MyContext'

const About = () => {

    const {name} = useContext(MyData)
  return (
    <div>
        <h1>the name is - {name}</h1>
    </div>
  )
}

export default About