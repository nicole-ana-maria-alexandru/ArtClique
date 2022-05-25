const getOtherUsername = (users : any, currentUserUsername : any) => {
    return users?.filter((user : any) => user !== currentUserUsername)[0] as string;
  }

export default getOtherUsername;