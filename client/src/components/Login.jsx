import React, { useState } from "react";
import './css/login.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [style, setStyle] = useState('logform');
    const [errormes, setErrormes] = useState('')

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', {username, password});

            if (response.data.result[0].banned === 1) {
                setErrormes('Šis vartotojas yra užblokuotas');
                setUsername('');
                setPassword('');
                setStyle('logform2')
                const responses = await axios.post('http://localhost:3000/logout')
            } else if (response.status === 200) {
                navigate('/main');
                console.log(response)     
            }

        } catch (error) {
            console.log(error);
            
             setErrormes('Blogas prisijungimo vardas arba slaptažodis');
             setUsername('');
             setPassword('');
             setStyle('logform2');       
            
        }
    
    }


    return (
        <div>
            <div className={style}>
                <h1 className="header">Prisijungimas</h1>
                <form onSubmit={handleLogin}>
                    <label>Vardas</label>
                    <input required  type="text" onChange={(e) => {setUsername(e.target.value)}} placeholder="Vardas" />
                    <label>Slaptažodis</label>
                    <input required type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="Slaptažodis" />
                    <p className="errormessage">{errormes}</p>
                    <p className="login">Neturite paskyros? <span className="loginbtn" onClick={() => {navigate('/register')}} >Prisiregistruok</span></p>
                    <button type="submit">Prisijungti</button>
                </form>
            </div>
        </div>
    )
}

export default Login;