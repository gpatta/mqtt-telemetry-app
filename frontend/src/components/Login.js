import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import '../styles/variables.css';
import '../styles/Login.css';

const Login = () => {

    const [input, setInput] = useState({
        username: '',
        password: ''
    });

    const auth = useAuth();
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== '' && input.password !== '') {
            auth.login(input);
            return;
        }
        alert('Please provide a valid username and password');
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <div className="LoginContainer">
            <h1>Login</h1>
            <form className="LoginForm" onSubmit={handleSubmitEvent}>
                <div className="FormGroup">
                    <label htmlFor="username">Email:</label>
                    <input className="FormInput"
                        type="email"
                        id="username"
                        name="username"
                        placeholder="example@yahoo.com"
                        aria-describedby="username"
                        aria-invalid="false"
                        onChange={handleInput}
                    />
                    {/* <div id="username" className="sr-only">
                        Please enter a valid username. It must contain at least 6 characters.
                    </div> */}
                </div>
                <div className="FormGroup">
                    <label htmlFor="password">Password:</label>
                    <input className="FormInput"
                        type="password"
                        id="password"
                        name="password"
                        aria-describedby="user-password"
                        aria-invalid="false"
                        onChange={handleInput}
                    />
                    {/* <div id="user-password" className="sr-only">
                        your password should be more than 6 character
                    </div> */}
                </div>
                <button className="LoginButton">Login</button>
            </form>
        </div>
    );

};

export default Login;
