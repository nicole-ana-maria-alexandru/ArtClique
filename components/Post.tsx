import React from 'react';
import { useAuth } from "../hooks/AuthContext";
import { useState, useEffect } from "react";

function Post({ id, username, userImg, img, caption }: {id: string; username: string; userImg:string, img:string, caption:string}) {
    const { userDetails } = useAuth();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
  
    return (
    <div>Post</div>
  )
}

export default Post