// cmps/LoginSignup.jsx
import { useState } from 'react'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function LoginSignup({ onLogin }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        fullname: ''
    })
    const [isSignup, setIsSignup] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials(credentials => ({ ...credentials, [field]: value }))
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        
        if (!credentials.username || !credentials.password) {
            showErrorMsg('Please enter username and password')
            return
        }
        
        if (isSignup && !credentials.fullname) {
            showErrorMsg('Please enter full name')
            return
        }
        
        try {
            setIsLoading(true)
            const user = isSignup 
                ? await userService.signup(credentials)
                : await userService.login(credentials)
            
            showSuccessMsg(isSignup ? 'Signed up successfully' : 'Logged in successfully')
            onLogin(user)
        } catch (err) {
            console.error(isSignup ? 'Failed to signup' : 'Failed to login', err)
            showErrorMsg(err.response?.data?.err || 'Authentication failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="login-signup">
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        required
                        autoComplete="username"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                        autoComplete="current-password"
                    />
                </div>
                
                {isSignup && (
                    <div className="form-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input
                            id="fullname"
                            type="text"
                            name="fullname"
                            value={credentials.fullname}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            required
                        />
                    </div>
                )}
                
                <button className="btn-submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
                </button>
            </form>
            
            <div className="auth-toggle">
                <p>
                    {isSignup 
                        ? 'Already have an account?' 
                        : 'Don\'t have an account?'}
                    <button 
                        className="btn-link"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Login' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </section>
    )
}