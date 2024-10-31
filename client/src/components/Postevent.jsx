import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Navigation } from "./Main";
import './css/postevent.css'


function PostEvent() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [time, setTime] = useState('');
    const [place, setPlace] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3000/login').then((response) => {
            if (response.data.LoggedIn == true) {
                setAuthor(response.data.user[0].username);               
            } 
        })
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/posts', {author, title, category, time, place, image, description});

            if (response.status === 200) {
                navigate('/unverified');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="main">
            <Navigation />
            <div className="Eventpost">               
                <h3 className="eventHeader"><div className="sqr"></div><div className="dec"></div>Sukurti naują renginio tema</h3>
                <form onSubmit={handleSubmit}>
                    <label className="postLabel" >Pavadinimas</label>
                    <input className="postInput" required placeholder="Renginio pavadinimas" type="text" onChange={(e) => {setTitle(e.target.value)}} />
                    <label className="postLabel">Kategorija</label>
                    <select className="postSelect" required onChange={(e) => {setCategory(e.target.value)}}>
                        <option>Svarbus</option>
                        <option>Laisvalaikis</option>
                        <option>Politika</option>
                    </select>
                    <label className="postLabel">Laikas</label>
                    <input className="postInput" placeholder="Renginio laikas" required onChange={(e) => {setTime(e.target.value)}} type="text" />
                    <label className="postLabel">Vieta</label>
                    <input className="postInput" type="text" required onChange={(e) => {setPlace(e.target.value)}} placeholder="Renginio vieta" />
                    <label className="postLabel">Nuotrauka</label>
                    <input className="postImg"  type="text" placeholder="Iveskite nuotraukos nuorodą"  onChange={(e) => {setImage(e.target.value)}} />
                    <label className="postLabel">Aprašymas</label>
                    <textarea className="postDescription" required onChange={(e) => {setDescription(e.target.value)}} ></textarea>
                    <button className="postBtn" type="submit">Pateikti temą</button>
                </form>
            </div>
            <footer>2024 © Miesto renginiai</footer>
        </div>
    )
}

export default PostEvent;