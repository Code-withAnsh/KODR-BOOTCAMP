import React from 'react'

const Navbar = ({settoggle,toggle}) => {
  return (
    <nav className=' bg-blue-600 w-full p-3   rounded-2xl flex justify-between align-center
    gap-5'>
      <div>
        <h2>Logo</h2>
      </div>
      <div className='w-full flex gap-5 justify-center items-center'>
        <h3>Home</h3>
        <h3>About</h3>
        <h3>Contact</h3>
      </div>
      <button 
      onClick={()=>settoggle((prev)=>!prev)}
      className='px-4 py-1 border-2 rounded-[10px]'>
       { toggle?"Clsoe":"create"}
      </button>
    </nav>
  );
}

export default Navbar