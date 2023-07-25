import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../context/MainContext';

const usePostNavigate = () => {
    const {setPostId} = useContext(MainContext)
    const navigate  = useNavigate()
    const getPostId = (id) => {
        setPostId(id);
        navigate(`/posts/${id}`);
      };
  return getPostId
}

export default usePostNavigate