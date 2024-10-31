import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Navigation } from "./Main";
import './css/unverified.css'

function Verified() {
    const [posts, setposts] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [adminMenuBtn, setadminMenuBtn] = useState('selecWrapNone')
    const [adminPanel, setAdminPanel] = useState(null)

    const [postid, setPostid] = useState()
    const [category, setCategory] = useState('')
    
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3000/authors').then((response) => {
            setAuthors(response.data.result)
            
        })

        axios.get('http://localhost:3000/verifiedposts').then((response) => {
            if (response.data.result.length > 0) {
                setposts(response.data.result)
            }
        })
        axios.get('http://localhost:3000/login').then((response) => {
            if (response.data.LoggedIn == true) {
                if (response.data.user[0].admin === 0) {
                setadminMenuBtn('selecWrapNone');
                } else {
                setadminMenuBtn('selecWrap');
                }
            }
            
        })
    }, [])
    const Ids = () => {
        const postsIds = posts.map((post) => {
            const authorsIds = authors.find(authorid => authorid.username === post.author);
            return {
                ...post,
                authorsIds: authorsIds || null
            }
        });
        return postsIds;
    }

    const handleAdminPanel = (index) => {
        setAdminPanel((previndex) => previndex === index ? null : index)
    }

    const handleAdminCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/admincategory', {category, postid})

            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAdminRemove = async () => {
        try {
            const response = await axios.post('http://localhost:3000/deletepost', {postid});

            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAdminUnverify = async () => {
        try {
            const response = await axios.post('http://localhost:3000/adminunverify', {postid});

            if(response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="main">
            <Navigation />
            <div className="unverifiedHead">               
                <h3 className="eventText"><div className="sqr"></div>Patvirtinti renginiai</h3>
            </div>
            {Ids().map((post, index) => (
                <div className="postWrap" key={post.eventid}>
                <div className="post">
                <div className="userSection">
                    <img src={post.authorsIds?.profilepicture || 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'}alt="."></img>
                    <p className="authortext">{post.author}</p>
                    {post.authorsIds && post.authorsIds.admin === 0 ? <div className="statuswrap"> <p className="statustext">Narys</p> </div> : <div className="adminwrap" > <p className="statustext">Administratorius</p> </div> }
                </div>
                <div className="postSection">
                    <h2>{post.title}</h2>
                    <p><strong>Renginio kategorija:</strong> {post.category}</p>
                    <p><strong>Renginio Laikas:</strong> {post.time}</p>
                    <p><strong>Renginio Vieta:</strong> {post.place}</p>
                    <img src={post.image}></img>
                    <p className="desc"><strong>Aprašymas:</strong> {post.description}</p>
                    <div className={adminMenuBtn}><button className="adminBtn" onClick={() => {handleAdminPanel(index); setPostid(post.eventid); setCategory(post.category);}}>Nustatymai</button></div>
                </div>
                </div>
                {adminPanel === index && (
                    <div> 
                        <h3 className="adminText"><div className="adminsqr"></div>Administratoriaus nustatymai</h3>
                        <form onSubmit={handleAdminCategory}>
                            <label className="postLabel">Keisti temos kategorija</label>
                            <div className="categorywrap">
                                <select className="postSelect" defaultValue={category} required onChange={(e) => {setCategory(e.target.value)}}>
                                    <option>Svarbus</option>
                                    <option>Laisvalaikis</option>
                                    <option>Politika</option>
                                </select>
                                <button className="admincategory" type="submit">Redaguoti</button>
                            </div>                            
                        </form>
                        <div className="adminBtnWrap">
                            <button className="adminremove" onClick={handleAdminRemove}>Pašalinti tema</button>
                            <button className="adminUnverify" onClick={handleAdminUnverify}>Pašalinti iš patvirtintų</button>
                        </div>
                    </div>
                )}
                </div>
                
            ))}
            <footer>2024 © Miesto renginiai</footer>
        </div>
    )
}

export default Verified;