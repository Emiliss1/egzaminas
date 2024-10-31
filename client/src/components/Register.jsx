import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stytle, setStyle] = useState('logform');
    const [errormes, setErrormes] = useState('')

    axios.defaults.withCredentials = true;

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', {username, password});

            if (response.status === 200) {
                navigate('/')
            } 

        } catch (error) {
            console.log(error);
            if (error.status === 400) {
             setErrormes('Vartotojas su tokiu vardu jau egzistuoja');
             setUsername('');
             setPassword('');
             setStyle('logform2');       
            }
        }
    }

    const navigate = useNavigate();
    return (
        <div>
            <div className={stytle}>
                <h1 className="header">Registracija</h1>
                <form onSubmit={handleRegister}>
                    <label>Vardas</label>
                    <input required  type="text" onChange={(e) => {setUsername(e.target.value)}} minLength={4} maxLength={20} placeholder="Vardas" />
                    <p className="errormessage">{errormes}</p>
                    <label>Slaptažodis</label>
                    <input required type="password" onChange={(e) => {setPassword(e.target.value)}} minLength={6} maxLength={50} placeholder="Slaptažodis" />
                    <p className="login">Turite paskyrą? <span className="loginbtn" onClick={() => {navigate('/')}} >Prisijunk</span></p>
                    <button type="submit">Registruotis</button>
                </form>
            </div>
        </div>
    )
}

export default Register;