import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useDisclosure,
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
  FormControl,
  HStack,
  Heading,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderMark,
} from "@chakra-ui/react";
import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { NextPage } from "next/types";
import React, { useEffect, useRef, useState } from "react";
import NavMenu from "../components/NavMenu";
import { useAuth } from "../hooks/AuthContext";
import { db } from "../hooks/firebase/firebase";
import UserExploreCard from "../components/UserExploreCard";
import PieceExploreCard from "../components/PieceExploreCard";
import router from "next/router";

const Explore: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef<HTMLInputElement>(null);
  const [tabIndex, setTabIndex] = useState<any>(0);
  const [openDrawerProfile, setOpenDrawerProfile] = useState(false);
  const [openDrawerPiece, setOpenDrawerPiece] = useState(false);
  const { userDetails } = useAuth();

  //for Profiles
  const [profiles, setProfiles] = useState<any>([]);
  const [resetProfiles, setResetProfiles] = useState<any>([]);
  const [countries, setCountries] = useState<any>([]);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const sortingCriterionRef = useRef<HTMLSelectElement>(null);
  const sortingOrderRef = useRef<HTMLSelectElement>(null);
  const [filtersCountry, setFiltersCountry] = useState<any>([]);
  const [filtersInterests, setFiltersInterests] = useState<any>([]);
  const [filtersOccupations, setFiltersOccupations] = useState<any>([]);
  const [filterFirstName, setFilterFirstName] = useState<any>(null);
  const [filterLastName, setFilterLastName] = useState<any>(null);
  const [profileOrderCriterion, setProfileOrderCriterion] = useState<any>(null);
  const [profileOrder, setProfileOrder] = useState<any>(null);
  const [profileResultsFound, setProfileResultsFound] = useState<any>(true);
  const [resultedPiece, setResultedPiece] = useState<any>({});

  //for Pieces
  const [posts, setPosts] = useState<any>([]);
  const [pieces, setPieces] = useState<any>([]);
  const [resetPieces, setResetPieces] = useState<any>([]);
  const [pieceResultsFound, setPieceResultsFound] = useState<any>(true);
  const [pieceOrderCriterion, setPieceOrderCriterion] = useState<any>(null);
  const [pieceOrder, setPieceOrder] = useState<any>(null);
  const sortingPieceCriterionRef = useRef<HTMLSelectElement>(null);
  const sortingPieceOrderRef = useRef<HTMLSelectElement>(null);
  const [filterArtistName, setFilterArtistName] = useState<any>(null);
  const artistNameRef = useRef<HTMLInputElement>(null);
  const pieceTitleRef = useRef<HTMLInputElement>(null);
  const [filterPieceTitle, setFilterPieceTitle] = useState<any>(null);
  const cbAvailabilityRef = useRef<HTMLInputElement>(null);
  const [filterAvailability, setFilterAvailability] = useState(false);
  const [filtersType, setFiltersType] = useState<any>([]);
  const [sliderPriceValue, setSliderPriceValue] = useState([200, 250]);
  const [measurementUnit, setMeasurementUnit] = useState<any>(null);
  const measurementUnitRef = useRef<HTMLSelectElement>(null);
  const [maxPrice, setMaxPrice] = useState<any>(0);
  const [minPrice, setMinPrice] = useState<any>(0);
  const cbPriceRef = useRef<HTMLInputElement>(null);
  const [filterPrice, setFilterPrice] = useState(false);
  const [filtersStyle, setFiltersStyle] = useState<any>([]);
  const [filtersSubject, setFiltersSubject] = useState<any>([]);

  const handleDrawerProfileClose = () => {
    setOpenDrawerProfile(false);
  };

  const handleDrawerPieceClose = () => {
    setOpenDrawerPiece(false);
  };

  const cbInterestsValues = [
    "Painting",
    "Drawing",
    "Sketch",
    "Digital Art",
    "Photography",
    "Sculpture",
  ];
  const cbOccupationsValues = [
    "Art lover",
    "Artist",
    "Broker",
    "Collector",
    "Professor",
    "Gallerist",
    "Curator",
  ];

  const cbPieceTypeValues = [
    "Painting",
    "Drawing",
    "Sketch",
    "Digital Art",
    "Photography",
    "Sculpture",
  ];

  const styleValues = [
    "Contemporary",
    "Street Art",
    "Pop Art",
    "Realism",
    "Abstract",
    "Modernism",
    "Expressionism",
    "Impressionism",
    "Post-war",
    "Old Masters",
  ];

  const subjectValues = [
    "Portrait",
    "Landscape",
    "Animals",
    "Birds",
    "History",
    "Animation",
    "Graffiti",
    "Sport",
    "Celebrities",
    "Still life",
  ];

  const handleCountryFilters = (e: any, value: any) => {
    const results = filtersCountry;
    if (e.target.checked) results.push(value);
    else {
      if (results.indexOf(value) > -1) {
        results.splice(results.indexOf(value), 1);
      }
    }
    setFiltersCountry(results);
  };

  const handleInterestsFilters = (e: any, value: any) => {
    const results = filtersInterests;
    if (e.target.checked) results.push(value);
    else {
      if (results.indexOf(value) > -1) {
        results.splice(results.indexOf(value), 1);
      }
    }
    setFiltersInterests(results);
  };

  const handleOccupationsFilters = (e: any, value: any) => {
    const results = filtersOccupations;
    if (e.target.checked) results.push(value);
    else {
      if (results.indexOf(value) > -1) {
        results.splice(results.indexOf(value), 1);
      }
    }
    setFiltersOccupations(results);
  };

  const handleTypeFilters = (e: any, value: any) => {
    const results = filtersType;
    if (e.target.checked) results.push(value);
    else {
      if (results.indexOf(value) > -1) {
        results.splice(results.indexOf(value), 1);
      }
    }
    setFiltersType(results);
  };

  const handleStyleFilters = (e: any, value: any) => {
    const results = filtersStyle;
    if (e.target.checked) results.push(value);
    else {
      if (results.indexOf(value) > -1) {
        results.splice(results.indexOf(value), 1);
      }
    }
    setFiltersStyle(results);
  };

  const handleSubjectFilters = (e: any, value: any) => {
    const results = filtersSubject;
    if (e.target.checked) results.push(value);
    else {
      if (results.indexOf(value) > -1) {
        results.splice(results.indexOf(value), 1);
      }
    }
    setFiltersSubject(results);
  };

  useEffect(() => {
    (async function getProfiles() {
      const results: any[] = [];
      const resultsCountries: any[] = [];
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          username: doc.data().username,
          first_name: doc.data().first_name,
          last_name: doc.data().last_name,
          description: doc.data().description,
          country: doc.data().country,
          profile_img: doc.data().profile_img,
          followers: doc.data().followers,
          following: doc.data().following,
          tags: doc.data().tags,
          timestamp: doc.data().timestamp,
        });
        if (!resultsCountries.includes(doc.data().country)) {
          resultsCountries.push(doc.data().country);
        }
      });
      setProfiles(results);
      setResetProfiles(results);
      setCountries(resultsCountries);
    })();
  }, []);

  useEffect(() => {
    (async function getPieces() {
      const results: any[] = [];
      var minPrice;
      var maxPrice;
      // const resultsCountries: any[] = [];
      const q = query(collection(db, "pieces"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          artistName: doc.data().artistName,
          postId: doc.data().postId,
          title: doc.data().title,
          type: doc.data().type,
          image: doc.data().image,
          isAvailable: doc.data().isAvailable,
          year: doc.data().year,
          price: doc.data().price,
          currency: doc.data().currency,
          height: doc.data().height,
          width: doc.data().width,
          depth: doc.data().depth,
          measurementUnit: doc.data().measurementUnit,
          tags: doc.data().tags,
          timestamp: doc.data().timestamp,
        });
        // if (!resultsCountries.includes(doc.data().country)) {
        //   resultsCountries.push(doc.data().country);
        // }
      });
      setPieces(results);
      setResetPieces(results);
      setMinPrice(Math.min(...results.map((piece) => piece.price)));
      setMaxPrice(Math.max(...results.map((piece) => piece.price)));
      // if(minPrice && maxPrice)
      //   setSliderPriceValue([(minPrice + maxPrice)/2, (minPrice + maxPrice)/2 + 10]);
      // setCountries(resultsCountries);
    })();
  }, []);

  const applyProfileFilters = () => {
    let updatedProfileList = profiles;

    //First Name Filter
    if (filterFirstName?.trim()) {
      updatedProfileList = updatedProfileList.filter(
        (profile: any) =>
          profile.first_name.toLowerCase() === filterFirstName.toLowerCase()
      );
    }

    //Last Name Filter
    if (filterLastName?.trim()) {
      updatedProfileList = updatedProfileList.filter(
        (profile: any) =>
          profile.last_name.toLowerCase() === filterLastName.toLowerCase()
      );
    }

    //Country Filter
    if (filtersCountry.length) {
      updatedProfileList = updatedProfileList.filter((profile: any) =>
        filtersCountry.includes(profile.country)
      );
    }

    //Interests Filter
    if (filtersInterests.length) {
      updatedProfileList = updatedProfileList.filter(function (profile: any) {
        const containsAll = filtersInterests.every((filter: any) => {
          return profile.tags.includes(filter);
        });
        return containsAll;
      });
    }

    //Interests Filter
    if (filtersOccupations.length) {
      updatedProfileList = updatedProfileList.filter(function (profile: any) {
        const containsAll = filtersOccupations.every((filter: any) => {
          return profile.tags.includes(filter);
        });
        return containsAll;
      });
    }

    //Sort
    if (profileOrderCriterion && profileOrder) {
      if (
        profileOrderCriterion === "Creation Date" &&
        profileOrder === "Ascending"
      ) {
        updatedProfileList.sort((a: any, b: any) =>
          a.timestamp > b.timestamp ? 1 : -1
        );
      } else if (
        profileOrderCriterion === "Creation Date" &&
        profileOrder === "Descending"
      ) {
        updatedProfileList.sort((a: any, b: any) =>
          a.timestamp < b.timestamp ? 1 : -1
        );
      } else if (
        profileOrderCriterion === "Followers" &&
        profileOrder === "Ascending"
      ) {
        updatedProfileList.sort((a: any, b: any) =>
          a.followers?.length > b.followers?.length ? 1 : -1
        );
      } else if (
        profileOrderCriterion === "Followers" &&
        profileOrder === "Descending"
      ) {
        updatedProfileList.sort((a: any, b: any) =>
          a.followers?.length < b.followers?.length ? 1 : -1
        );
      } else if (
        profileOrderCriterion === "Following" &&
        profileOrder === "Ascending"
      ) {
        updatedProfileList.sort((a: any, b: any) =>
          a.following?.length > b.following?.length ? 1 : -1
        );
      } else if (
        profileOrderCriterion === "Following" &&
        profileOrder === "Descending"
      ) {
        updatedProfileList.sort((a: any, b: any) =>
          a.following?.length < b.following?.length ? 1 : -1
        );
      }
    }

    setProfiles(updatedProfileList);

    !updatedProfileList.length
      ? setProfileResultsFound(false)
      : setProfileResultsFound(true);

    setOpenDrawerProfile(false);
  };

  const resetProfileFilters = () => {
    setProfiles(resetProfiles);
    setFiltersCountry([]);
    setFiltersInterests([]);
    setFiltersOccupations([]);
    setFilterFirstName(null);
    setFilterLastName(null);
    setProfileOrderCriterion(null);
    setProfileOrder(null);
    setProfileResultsFound(true);
    setOpenDrawerProfile(false);
  };

  const applyPieceFilters = () => {
    let updatedPieceList = pieces;

    //Title Filter
    if (filterPieceTitle?.trim()) {
      updatedPieceList = updatedPieceList.filter((piece: any) =>
        piece.title.toLowerCase().includes(filterPieceTitle.toLowerCase())
      );
    }

    //Artist Name Filter
    if (filterArtistName?.trim()) {
      updatedPieceList = updatedPieceList.filter((piece: any) =>
        piece.artistName.toLowerCase().includes(filterArtistName.toLowerCase())
      );
    }

    //Artist Name Filter
    if (filterAvailability) {
      updatedPieceList = updatedPieceList.filter(
        (piece: any) => piece.isAvailable
      );
    }

    //Type Filter
    if (filtersType.length) {
      updatedPieceList = updatedPieceList.filter((piece: any) =>
        filtersType.includes(piece.type)
      );
    }

    //Price Filter
    if (filterPrice) {
      updatedPieceList = updatedPieceList.filter((piece: any) =>
        piece.price >= sliderPriceValue[0] && piece.price <= sliderPriceValue[1]
      );
    }

    //Subject Filter
    if (filtersSubject.length) {
      updatedPieceList = updatedPieceList.filter(function (piece: any) {
        const containsAll = filtersSubject.every((filter: any) => {
          return piece.tags.includes(filter);
        });
        return containsAll;
      });
    }

    //Style Filter
    if (filtersStyle.length) {
      updatedPieceList = updatedPieceList.filter(function (piece: any) {
        const containsAll = filtersStyle.every((filter: any) => {
          return piece.tags.includes(filter);
        });
        return containsAll;
      });
    }

    //Sort
    if (pieceOrderCriterion && pieceOrder) {
      if (
        pieceOrderCriterion === "Listing Date" &&
        pieceOrder === "Ascending"
      ) {
        updatedPieceList.sort((a: any, b: any) =>
          a.timestamp > b.timestamp ? 1 : -1
        );
      } else if (
        pieceOrderCriterion === "Listing Date" &&
        pieceOrder === "Descending"
      ) {
        updatedPieceList.sort((a: any, b: any) =>
          a.timestamp < b.timestamp ? 1 : -1
        );
      } else if (
        pieceOrderCriterion === "Price" &&
        pieceOrder === "Ascending"
      ) {
        updatedPieceList.sort((a: any, b: any) =>
          a.price > b.price ? 1 : -1
        );
      } else if (
        pieceOrderCriterion === "Price" &&
        pieceOrder === "Descending"
      ) {
        updatedPieceList.sort((a: any, b: any) =>
          a.price < b.price ? 1 : -1
        );
      } else if (
        pieceOrderCriterion === "Year" &&
        pieceOrder === "Ascending"
      ) {
        updatedPieceList.sort((a: any, b: any) =>
          a.year > b.year ? 1 : -1
        );
      } else if (
        pieceOrderCriterion === "Year" &&
        pieceOrder === "Descending"
      ) {
        updatedPieceList.sort((a: any, b: any) =>
          a.year < b.year ? 1 : -1
        );
      }
    }

    setPieces(updatedPieceList);

    !updatedPieceList.length
      ? setPieceResultsFound(false)
      : setPieceResultsFound(true);

    setOpenDrawerPiece(false);
  };

  const resetPieceFilters = () => {
    setPieces(resetPieces);
    setFiltersStyle([]);
    setFiltersSubject([]);
    setFiltersType([]);
    setFilterArtistName(null);
    setFilterPieceTitle(null);
    setFilterAvailability(false);
    setMeasurementUnit(null);
    setSliderPriceValue([200, 250]);
    setFilterPrice(false);
    setPieceOrderCriterion(null);
    setPieceOrder(null);
    setPieceResultsFound(true);
    setOpenDrawerPiece(false);
  };

  return (
    <NavMenu>
      <Tabs
        isFitted
        variant="soft-rounded"
        onChange={(index: any) => setTabIndex(index)}
      >
        <TabList mb="1em">
          <Tab
            _selected={{ color: "gray.100", bg: "blue.500" }}
            bg={"blue.200"}
            color={"gray.500"}
          >
            Explore profiles
          </Tab>
          <Tab
            _selected={{ color: "gray.100", bg: "purple.500" }}
            bg={"purple.200"}
            color={"gray.500"}
          >
            Explore pieces
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Center>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                color={"gray.100"}
                onClick={() => setOpenDrawerProfile(true)}
                sx={{ position: "-webkit-sticky", top: "0" }}
              >
                Apply filters to profiles
              </Button>
            </Center>
          </TabPanel>
          <TabPanel>
            <Center>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="purple"
                color={"gray.100"}
                onClick={() => setOpenDrawerPiece(true)}
                sx={{ position: "-webkit-sticky", top: "0" }}
              >
                Apply filters to pieces
              </Button>
            </Center>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {tabIndex == 0 && (
        <Center>
          {!profileResultsFound ? (
            <>
              <Heading>No results were found</Heading>
            </>
          ) : (
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
              {profiles.map((profile: any) => (
                <Box
                  key={profile.id}
                  onClick={() => router.push(`/profile/${profile.id}`)}
                  cursor={"pointer"}
                >
                  <UserExploreCard
                    key={profile.id}
                    id={profile.id}
                    username={profile.username}
                    profile_img={profile.profile_img}
                    first_name={profile.first_name}
                    last_name={profile.last_name}
                    country={profile.country}
                    description={profile.description}
                    following={profile.following}
                    followers={profile.followers}
                    tags={profile.tags}
                    timestamp={profile.timestamp}
                  ></UserExploreCard>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Center>
      )}

      {tabIndex == 1 && (
        <Center>
          {!pieceResultsFound ? (
            <>
              <Heading>No results were found</Heading>
            </>
          ) : (
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
              {pieces.map((piece: any) => (
                <Box key={piece.id}>
                  <PieceExploreCard
                    key={piece.id}
                    id={piece.id}
                    artistName={piece.artistName}
                    postId={piece.postId}
                    title={piece.title}
                    type={piece.type}
                    image={piece.image}
                    isAvailable={piece.isAvailable}
                    year={piece.year}
                    price={piece.price}
                    currency={piece.currency}
                    height={piece.height}
                    width={piece.width}
                    depth={piece.depth}
                    measurementUnit={piece.measurementUnit}
                    tags={piece.tags}
                    timestamp={piece.timestamp}
                  ></PieceExploreCard>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Center>
      )}

      <Drawer
        isOpen={openDrawerProfile}
        onClose={handleDrawerProfileClose}
        placement="right"
        initialFocusRef={firstField}
        size={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Profile filters</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <FormControl>
                <FormLabel htmlFor="criterion">Sorting criteria</FormLabel>
                <HStack>
                  <Select
                    id="criterion"
                    placeholder="Select a criterion"
                    ref={sortingCriterionRef}
                    value={profileOrderCriterion}
                    onChange={() => {
                      setProfileOrderCriterion(
                        sortingCriterionRef.current?.value
                      );
                    }}
                  >
                    <option>Creation Date</option>
                    <option>Followers</option>
                    <option>Following</option>
                  </Select>
                  <Select
                    id="order"
                    placeholder="Select an order"
                    ref={sortingOrderRef}
                    value={profileOrder}
                    onChange={() => {
                      setProfileOrder(sortingOrderRef.current?.value);
                    }}
                  >
                    <option>Ascending</option>
                    <option>Descending</option>
                  </Select>
                </HStack>
              </FormControl>

              <Box>
                <FormControl>
                  <FormLabel>Filter by first name</FormLabel>
                  <Input
                    ref={firstNameRef}
                    placeholder="First Name"
                    value={filterFirstName}
                    onChange={() => {
                      setFilterFirstName(firstNameRef.current?.value);
                    }}
                  />
                </FormControl>
              </Box>

              <Box pb={6}>
                <FormControl>
                  <FormLabel>Filter by last name</FormLabel>
                  <Input
                    ref={lastNameRef}
                    placeholder="Last Name"
                    value={filterLastName}
                    onChange={() => {
                      setFilterLastName(lastNameRef.current?.value);
                    }}
                  />
                </FormControl>
              </Box>
            </Stack>

            <FormControl pb={6}>
              <FormLabel fontWeight={700} fontSize={"lg"}>
                Country
              </FormLabel>
              <Box overflowY={"scroll"} height={"150px"} pl={4}>
                <CheckboxGroup
                  colorScheme="purple"
                  defaultValue={filtersCountry}
                >
                  <Stack spacing={[1, 5]} direction={"column"}>
                    {countries.map((value: any) => (
                      <Checkbox
                        key={value}
                        value={value}
                        onChange={(e: any) => handleCountryFilters(e, value)}
                      >
                        {value}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </FormControl>

            <FormControl pb={6}>
              <FormLabel fontWeight={700} fontSize={"lg"}>
                Interests
              </FormLabel>
              <Box overflowY={"scroll"} height={"150px"} pl={4}>
                <CheckboxGroup
                  colorScheme="purple"
                  defaultValue={filtersInterests}
                >
                  <Stack spacing={[1, 5]} direction={"column"}>
                    {cbInterestsValues.map((value: any) => (
                      <Checkbox
                        key={value}
                        value={value}
                        onChange={(e: any) => handleInterestsFilters(e, value)}
                      >
                        {value}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight={700} fontSize={"lg"}>
                Occupations
              </FormLabel>
              <Box overflowY={"scroll"} height={"150px"} pl={4}>
                <CheckboxGroup
                  colorScheme="purple"
                  defaultValue={filtersOccupations}
                >
                  <Stack spacing={[1, 5]} direction={"column"}>
                    {cbOccupationsValues.map((value: any) => (
                      <Checkbox
                        key={value}
                        value={value}
                        onChange={(e: any) =>
                          handleOccupationsFilters(e, value)
                        }
                      >
                        {value}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </FormControl>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant={"outline"} mr={4} onClick={resetProfileFilters}>
              Reset filters
            </Button>
            <Button colorScheme="blue" onClick={applyProfileFilters}>
              Apply filters
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={openDrawerPiece}
        onClose={handleDrawerPieceClose}
        placement="right"
        initialFocusRef={firstField}
        size={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Piece filters</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <FormControl>
                <FormLabel htmlFor="criterion">Sorting criteria</FormLabel>
                <HStack>
                  <Select
                    id="criterion"
                    placeholder="Select a criterion"
                    ref={sortingPieceCriterionRef}
                    value={pieceOrderCriterion}
                    onChange={() => {
                      setPieceOrderCriterion(
                        sortingPieceCriterionRef.current?.value
                      );
                    }}
                  >
                    <option>Price</option>
                    <option>Year</option>
                    <option>Listing Date</option>
                  </Select>
                  <Select
                    id="order"
                    placeholder="Select an order"
                    ref={sortingPieceOrderRef}
                    value={pieceOrder}
                    onChange={() => {
                      setPieceOrder(sortingPieceOrderRef.current?.value);
                    }}
                  >
                    <option>Ascending</option>
                    <option>Descending</option>
                  </Select>
                </HStack>
              </FormControl>

              <Box>
                <FormControl>
                  <FormLabel>Filter by piece title</FormLabel>
                  <Input
                    ref={pieceTitleRef}
                    placeholder="Piece title"
                    value={filterPieceTitle}
                    onChange={() => {
                      setFilterPieceTitle(pieceTitleRef.current?.value);
                    }}
                  />
                </FormControl>
              </Box>

              <Box>
                <FormControl>
                  <FormLabel>Filter by artist name</FormLabel>
                  <Input
                    ref={artistNameRef}
                    placeholder="Artist Name"
                    value={filterArtistName}
                    onChange={() => {
                      setFilterArtistName(artistNameRef.current?.value);
                    }}
                  />
                </FormControl>
              </Box>

              <FormControl>
                <FormLabel>Availability</FormLabel>
                <Checkbox
                  colorScheme="purple"
                  isChecked={filterAvailability}
                  onChange={() =>
                    filterAvailability
                      ? setFilterAvailability(false)
                      : setFilterAvailability(true)
                  }
                  ref={cbAvailabilityRef}
                >
                  Is it available?
                </Checkbox>
              </FormControl>

              <FormControl pb={6}>
                <FormLabel fontWeight={700} fontSize={"lg"}>
                  Type
                </FormLabel>
                <Box overflowY={"scroll"} height={"150px"} pl={4}>
                  <CheckboxGroup
                    colorScheme="purple"
                    defaultValue={filtersType}
                  >
                    <Stack spacing={[1, 5]} direction={"column"}>
                      {cbPieceTypeValues.map((value: any) => (
                        <Checkbox
                          key={value}
                          value={value}
                          onChange={(e: any) => handleTypeFilters(e, value)}
                        >
                          {value}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Price</FormLabel>
                <Checkbox
                  colorScheme="purple"
                  isChecked={filterPrice}
                  onChange={() =>
                    filterPrice ? setFilterPrice(false) : setFilterPrice(true)
                  }
                  ref={cbPriceRef}
                >
                  Filter by price?
                </Checkbox>
              </FormControl>

              {filterPrice && (
                <RangeSlider
                  mt={6}
                  aria-label={["min", "max"]}
                  colorScheme="purple"
                  defaultValue={sliderPriceValue}
                  onChange={(val: any) => setSliderPriceValue(val)}
                  min={minPrice}
                  max={maxPrice}
                >
                  <RangeSliderMark
                    value={sliderPriceValue[0]}
                    textAlign="center"
                    bg="blue.500"
                    color="white"
                    mt="-10"
                    ml="-5"
                    w="12"
                  >
                    {sliderPriceValue[0]}
                  </RangeSliderMark>
                  <RangeSliderMark
                    value={sliderPriceValue[1]}
                    textAlign="center"
                    bg="blue.500"
                    color="white"
                    mt="-10"
                    ml="-5"
                    w="12"
                  >
                    {sliderPriceValue[1]}
                  </RangeSliderMark>
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
              )}

              {/* <FormControl>
                <FormLabel>Unit of measurement</FormLabel>
                <Select
                    id="measurementUnit"
                    placeholder="Select a unit of measurement"
                    ref={measurementUnitRef}
                    value={measurementUnit}
                    onChange={() => {
                      setMeasurementUnit(measurementUnitRef.current?.value);
                    }}
                  >
                    <option>cm</option>
                    <option>m</option>
                    <option>px</option>
                  </Select>
              </FormControl> */}

              <FormControl>
                <FormLabel fontWeight={700} fontSize={"lg"}>
                  Subject
                </FormLabel>
                <Box overflowY={"scroll"} height={"150px"} pl={4}>
                  <CheckboxGroup
                    colorScheme="purple"
                    defaultValue={filtersSubject}
                  >
                    <Stack spacing={[1, 5]} direction={"column"}>
                      {subjectValues.map((value: any) => (
                        <Checkbox
                          key={value}
                          value={value}
                          onChange={(e: any) => handleSubjectFilters(e, value)}
                        >
                          {value}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight={700} fontSize={"lg"}>
                  Style
                </FormLabel>
                <Box overflowY={"scroll"} height={"150px"} pl={4}>
                  <CheckboxGroup
                    colorScheme="purple"
                    defaultValue={filtersStyle}
                  >
                    <Stack spacing={[1, 5]} direction={"column"}>
                      {styleValues.map((value: any) => (
                        <Checkbox
                          key={value}
                          value={value}
                          onChange={(e: any) => handleStyleFilters(e, value)}
                        >
                          {value}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
          <Button variant={"outline"} mr={4} onClick={resetPieceFilters}>
              Reset filters
            </Button>
            <Button colorScheme="blue" onClick={applyPieceFilters}>
              Apply filters
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </NavMenu>
  );
};

export default Explore;
