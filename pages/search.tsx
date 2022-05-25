import { Center } from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Searchbar from "../components/explore/Searchbar";
import NavMenu from "../components/NavMenu";

const Search: NextPage = () => {

    return(
        <NavMenu>
            <Center>
            <Searchbar></Searchbar>
            </Center>
        </NavMenu>
    );
} 

export default Search;