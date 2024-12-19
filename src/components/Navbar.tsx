import { Bell } from "lucide-react"

interface INavbar {
  children: React.ReactNode
}
export default function Navbar({children}: INavbar) {
  return (
    <div className='w-full h-16 px-10 flex justify-between items-center bg-gradient-to-r from-black to-[#2f6377]'>
      <div className='flex items-center gap-5'>
        <img src="/logo.png" alt="logo" className='max-w-full max-h-16 object-contain' />
        <h1>iMeeting</h1>
      </div>

      <div className='flex items-center gap-5'>
        <Bell className='text-white' />
        <h1>JohnDoe</h1>
      </div>

      {children}
    </div>
  )
}
