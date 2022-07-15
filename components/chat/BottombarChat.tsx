import React, { useState } from "react";
import { FormControl, Input, Button, HStack } from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../hooks/firebase/firebase";

function BottombarChat({ id, userId }: { id: any; userId: any }) {
  const [input, setInput] = useState("");

  const sendMessage = async (e: any) => {
    e.preventDefault();
    await addDoc(collection(db, `chats/${id}/messages`), {
      text: input,
      sender: userId,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  return (
    <>
      <HStack>
        <FormControl p={3} as="form" onSubmit={sendMessage}>
          <Input
            placeholder="Type a message..."
            autoComplete="off"
            onChange={(e: any) => setInput(e.target.value)}
            value={input}
            bg={"white"}
          />
          <Button type="submit" hidden>
            Submit
          </Button>
        </FormControl>
      </HStack>
    </>
  );
}

export default BottombarChat;
