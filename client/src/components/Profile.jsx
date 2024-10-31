import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Navigation } from "./Main";
import './css/profile.css'

function ChangePicture() {
    const [picture, setPicture] = useState('');
    const [username, setUsername] = useState('');

    

    useEffect(() => {
        axios.get('http://localhost:3000/login').then((response) => {
            if (response.data.LoggedIn == true) {
                setUsername(response.data.user[0].username)
            } 
        })
    }, []);

    const handleUpdatepic = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/profilepic', {picture, username})

            if (response) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>           
            <div className="picturemenu">
                <h2>Profilio nuotrauka</h2>
                <form onSubmit={handleUpdatepic}>
                    <label>Ikeltį nuotrauką</label>
                    <input type="text" required maxLength={500} placeholder="Iveskite nuotraukos nuorodą" onChange={(e) => {setPicture(e.target.value)}} />
                    <button className="submitpic" type="submit">Toliau</button>
                </form>
            </div>           
        </div>
    )
}

function Profile() {
    const [username, setUsername] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [showPictureMenu, setShowPictureMenu] = useState(false);
    const [showPostEdit, setShowPostEdit] = useState(null);
    const [userstatus, setUserstatus] = useState('');
    const [statusclass, setStatusclass] = useState('');
    const [profileposts, setProfileposts] = useState([]);

    const [postid, setPostid] = useState();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [time, setTime] = useState('');
    const [place, setPlace] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    axios.defaults.withCredentials = true;

    const navigate = useNavigate();


    useEffect(() => {
        axios.get('http://localhost:3000/login').then((response) => {
            if (response.data.LoggedIn == true) {
                setUsername(response.data.user[0].username)
                setProfilePic(response.data.user[0].profilepicture)
                console.log(response)
                if (response.data.user[0].admin === 0) {
                    setUserstatus('Narys')
                    setStatusclass('profileStatus')
                } else {
                    setUserstatus('Administratorius')
                    setStatusclass('adminStatus')
                }
            } 
        })
        axios.get('http://localhost:3000/profileposts').then((response) => {
            if (response.data.result.length > 0) {
                setProfileposts(response.data.result);
            }
        })
        
    }, []);

    const handlePicture = () => {
        setShowPictureMenu(prevState => !prevState);
    }

    const handleEditpost = (index) => {
        setShowPostEdit((prevIndex) => prevIndex === index ? null : index);
        
    }

    const handleConfirmEdit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        try {
            const response = await axios.post('http://localhost:3000/profileposts', {postid, title, category, time, place, image, description});
                    console.log(response)
                    if (response.status === 200) {
                        window.location.reload();
                    }
            
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleRemovePost = async () => {
        try {
            const response = await axios.post('http://localhost:3000/deletepost', {postid});

            if (response.status === 200) {
                window.location.reload();
            }

        } catch(error) {
            console.log(error)
        }
    }

    return (
        <div className="main">
            <Navigation />
            <div className="profileSection">
                <div className="banner"></div>
                <div className="infoSection">
                    <img className="profilePic" onClick={handlePicture} src={profilePic}></img>
                    <p className="profileName">{username}</p>
                    <p className={statusclass}>{userstatus}</p>             
                </div>     
            </div>
                {showPictureMenu && <ChangePicture />}
            <div className="userposts">
                <h3 className="userpostsheader">Turinys <span>(Redagavimas paspaudus renginio pavadinima)</span></h3>
                {profileposts.map((post, index) => (
                    <div className="userpost" key={post.eventid}>
                        <div className="postwrap">
                            <img className="postimg" src={profilePic}></img>
                            <p onClick={() => {handleEditpost(index); setPostid(post.eventid); setTitle(post.title); setCategory(post.category); setTime(post.time); setPlace(post.place); setImage(post.image); setDescription(post.description);}} className="posttitle">{post.title}</p>
                        </div>                   
                        <p className="postauthor">{post.author}</p>
                        <p className="postdesc">{post.description}</p>
                        {showPostEdit === index &&(
                            <div className='editpostmenu'>
                            <h3 className="editpostheader"><div className="sqr"></div>Redaguoti renginio tema</h3>
                            <form onSubmit={handleConfirmEdit}>
                                <label className="postLabel" >Pavadinimas</label>
                                <input className="postInput" required defaultValue={post.title} placeholder="Renginio pavadinimas" type="text" onChange={(e) => {setTitle(e.target.value)}} />
                                <label className="postLabel">Kategorija</label>
                                <select className="postSelect" defaultValue={post.category} required onChange={(e) => {setCategory(e.target.value)}}>
                                    <option>Svarbus</option>
                                    <option>Laisvalaikis</option>
                                    <option>Politika</option>
                                </select>
                                <label className="postLabel">Laikas</label>
                                <input className="postInput" placeholder="Renginio laikas" defaultValue={post.time} required onChange={(e) => {setTime(e.target.value)}} type="text" />
                                <label className="postLabel">Vieta</label>
                                <input className="postInput" type="text" required defaultValue={post.place} onChange={(e) => {setPlace(e.target.value)}} placeholder="Renginio vieta" />
                                <label className="postLabel">Nuotrauka</label>
                                <input className="postImg"  type="text" defaultValue={post.image} placeholder="Iveskite nuotraukos nuorodą"  onChange={(e) => {setImage(e.target.value)}} />
                                <label className="postLabel">Aprašymas</label>
                                <textarea className="postDescription" defaultValue={post.description} required onChange={(e) => {setDescription(e.target.value)}} ></textarea>
                                <div className="btnWrap">
                                    <button className="postBtn" type="submit">Redaguoti</button>
                                    <button className="deleteBtn" type="button" onClick={handleRemovePost}>Pašalinti tema</button>
                                </div>                                
                            </form>
                            </div>      
                        )}
                        
                    </div>
                ))}
                
                
            </div>
            <footer>2024 © Miesto renginiai</footer>
        </div>
    )
}

export default Profile;