import LocationOnIcon from '@mui/icons-material/LocationOn'
import CancelIcon from '@mui/icons-material/Cancel'
import { useRef, useState } from "react"
import apiRequest from '../../../lib/ApiReqest'
import "./register.css"

const Register = ({ setShowRegister })=> {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const usernameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }

    try {
      await apiRequest.post("/api/user/register", newUser)
      setError(false)
      setSuccess(true)
    } catch (err) {
      setError(true)
    }
  }
  return (
    <div className="registerContainer">
      <div className="logo">
        <LocationOnIcon className="logoIcon" />
        <span>Map-Explore</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  )
}
export default Register