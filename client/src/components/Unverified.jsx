import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Navigation } from "./Main";
import './css/unverified.css';
import starimg from './assets/star.png';
import likedstar from './assets/likedstar.png';

function Unverified () {
    const [posts, setposts] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [adminMenuBtn, setadminMenuBtn] = useState('selecWrapNone');
    const [adminPanel, setAdminPanel] = useState(null);
    const [username, setUsername] = useState('');
    const [author, setAuthor] = useState('');
    const [star, setStar] = useState(starimg)

    const [postid, setPostid] = useState();
    const [category, setCategory] = useState('');

    
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3000/authors').then((response) => {
            setAuthors(response.data.result)
            console.log(response.data.result)
            
        })

        axios.get('http://localhost:3000/posts').then((response) => {
            if (response.data.result.length > 0) {
                setposts(response.data.result)
            }
        })
        axios.get('http://localhost:3000/login').then((response) => {
            if (response.data.LoggedIn == true) {
                setUsername(response.data.user[0].username)
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

    const handleAdminVerify = async () => {
        try {
            const response = await axios.post('http://localhost:3000/adminverify', {postid});

            if(response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAdminBan = async () => {
        try {
            const response = await axios.post('http://localhost:3000/adminban', {author});

            if (response.status === 200) {
                window.location.reload();
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleAdminUnban = async () => {
        try {
            const response = await axios.post('http://localhost:3000/adminunban', {author});

            if (response.status === 200) {
                window.location.reload();
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleStar = () => {
            if (star == starimg) {
                setStar(likedstar)
            } else {
                setStar(starimg)
            }
       
    }

    return(
        <div className="main">
            <Navigation />
            <div className="unverifiedHead">               
                <h3 className="eventText"><div className="sqr"></div><div className="dec"></div>Nepatvirtinti renginiai</h3>
            </div>

            {Ids().map((post, index) => (
                <div className="postWrap" key={post.eventid}>
                <div className="post">
                <div className="userSection">
                    <img src={post.authorsIds?.profilepicture || 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'}alt="."></img>
                    <p className="authortext">{post.author}</p>

                    {(() => {
                        if (post.authorsIds && post.authorsIds.banned === 1) {
                            return (
                              <div status="Užblokuotas" className="statuswrap">
                                <p className="statustext">Užblokuotas</p>
                              </div>
                            );
                          } else if (post.authorsIds && post.authorsIds.admin === 1) {
                            return (
                              <div status="Administratorius" className="adminwrap">
                                <p className="statustext">Administratorius</p>
                              </div>
                            );
                          } else {
                            return (
                              <div status="Narys" className="statuswrap">
                                <p className="statustext">Narys</p>
                              </div>
                            );
                          }
                    })()}
                   
                </div>
                <div className="postSection">
                    <h2>{post.title}</h2>
                    <p><strong>Renginio kategorija:</strong> {post.category}</p>
                    <p><strong>Renginio Laikas:</strong> {post.time}</p>
                    <p><strong>Renginio Vieta:</strong> {post.place}</p>
                    <img className="postimage"  src={post.image}></img>
                    <p className="desc"><strong>Aprašymas:</strong> {post.description}</p>
                    <img className="star" onClick={handleStar} src={star}/>
                    <div className={adminMenuBtn}><button className="adminBtn" onClick={() => {handleAdminPanel(index); setPostid(post.eventid); setCategory(post.category); setAuthor(post.author)}}>Nustatymai</button></div>
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
                            <button className="adminVerify" onClick={handleAdminVerify}>Patvirtinti tema</button>

                            {(() => {
                                if (post.authorsIds && post.authorsIds.banned === 1) {
                                    return (
                                    <div>
                                        <button className="adminUnban" onClick={handleAdminUnban}>Atblokuoti vartotoja</button>
                                    </div>
                                    );
                                } else if (post.author === username) {
                                    return (
                                    <div>
                                        <p></p>
                                    </div>
                                    );
                                } else {
                                    return (
                                    <div>
                                        <button className="adminUnverify" onClick={handleAdminBan}>Blokuoti vartotoja</button>
                                    </div>
                                    );
                                }
                    })()}


                                                 
                        </div>
                    </div>
                )}
                </div>
                
            ))}
            <footer>2024 © Miesto renginiai</footer>
           
        </div>
    )
}

export default Unverified;