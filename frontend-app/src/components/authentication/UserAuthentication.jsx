import React, { useState, lazy, Suspense , useContext } from 'react'
import Loader from '../ui/Loader'
import Swal from 'sweetalert2' //Sweet alert

import { AuthContext } from '../../context/AuthContext'
const Register = lazy(() => import('../forms/register/Register'))
const Login = lazy(() => import('../forms/login/Login'))

const UserAuthentication = () => {
    const { currentUser , updateUser , myStorage } = useContext(AuthContext)
    const [showRegister, setShowRegister] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    const handleLogout = () => {
        // Show confirmation dialog with sweet alert
        Swal.fire({
            title: "Are you sure you want to log out?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout !"
          }).then((result) => {
            if (result.isConfirmed) {
                updateUser(null)
                myStorage.removeItem("user")
            }
          })
    }

    return (
        <>
            {currentUser ? (
                <button className="button logout" onClick={handleLogout}>
                    Log out
                </button>
            ) : (
                <div className="buttons">
                    <button className="button login" onClick={() => {
                        setShowLogin(true)
                        setShowRegister(false)
                    }}>
                        Log in
                    </button>
                    <button className="button register" onClick={() => {
                        setShowRegister(true)
                        setShowLogin(false)
                    }}>
                        Register
                    </button>
                </div>
            )}
            <Suspense fallback={<Loader/>}> 
            {showRegister && <Register setShowRegister={setShowRegister} />}
            {showLogin && <Login setShowLogin={setShowLogin}/>}
            </Suspense>
        </>
    )
}

export default UserAuthentication
