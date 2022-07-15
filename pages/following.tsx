import { NextPage } from "next/types";
import NavMenu from "../components/NavMenu";
import { useAuth } from "../hooks/AuthContext";
import { db } from "../hooks/firebase/firebase";
import UserExploreCard from "../components/UserExploreCard";
import router from "next/router";
import { useEffect, useState } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { Center, Heading, SimpleGrid, Box } from "@chakra-ui/react";


const Following: NextPage = () => {
    const { userDetails } = useAuth();
    const [profiles, setProfiles] = useState<any>([]);
    const [areResults, setAreResults] = useState<any>(true);

    useEffect(() => {
        (async function getProfiles() {
          if (userDetails && userDetails?.following?.length > 0) {
            const q = query(
              collection(db, "users"),
              where("id", "in", userDetails?.following)
            );
            const querySnapshot = await getDocs(q);
            setProfiles(querySnapshot.docs);
          }
        })();
      }, [userDetails]);

    return (
        <NavMenu>
            <Center>
          {!profiles.length ? (
            <>
              <Heading>The Following list is empty</Heading>
            </>
          ) : (
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
              {profiles.map((profile: any) => (
                <Box onClick={() => router.push(`/profile/${profile.id}`)} cursor={'pointer'}>
                  <UserExploreCard
                    key={profile.data().id}
                    id={profile.data().id}
                    username={profile.data().username}
                    profile_img={profile.data().profile_img}
                    first_name={profile.data().first_name}
                    last_name={profile.data().last_name}
                    country={profile.data().country}
                    description={profile.data().description}
                    following={profile.data().following}
                    followers={profile.data().followers}
                    tags={profile.data().tags}
                    timestamp={profile.data().timestamp}
                  ></UserExploreCard>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Center>
        </NavMenu>
    );
}

export default Following;