import React from 'react';
import type { NextPage } from "next";
import UserProfileCard from '../components/UserProfileCard';
import NavMenu from '../components/NavMenu'

const Profile: NextPage = () => {
  return (
    <div>
        <NavMenu>
            <UserProfileCard/>
        </NavMenu>
    </div>
  )
}

export default Profile