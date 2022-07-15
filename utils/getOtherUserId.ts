const getOtherUserId = (users : any, currentUserId : any) => {
    return users?.filter((user : any) => user !== currentUserId)[0] as string;
  }

export default getOtherUserId;