import React, { useContext } from 'react'
import Home from './Home'
import Form from './Components/Form'
import UserCard from './Components/UserCard'
import Navbar from './Components/Navbar'
import { MyData } from './Context/MyContext'

const App = () => {
  let {toggle,settoggle,userData} = useContext(MyData)
  return (
    <div className="h-screen w-screen bg-gray-800 text-white p-4 text-3xl">
      <Navbar />
      <Home />
      {toggle ? (
        <Form />
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userData.map((val) => (
            <UserCard key={val.id} user={val} />
          ))}
        </section>
      )}
    </div>
  );
}

export default App