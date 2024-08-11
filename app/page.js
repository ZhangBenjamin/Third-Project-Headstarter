"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, Im the Headstarter Support Agent, how can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };
  const buttonSX = {
    color: "white",
    backgroundColor: "rgb(17, 71, 27)",
    boxShadow: 3,
    "&:hover": {
      border: "1px solid #00FF00",
      color: "black",
      backgroundColor: "rgb(37, 91, 27)",
    },
  };
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      backgroundColor="rgb(104, 150, 104)"
    >
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        backgroundColor="rgb(177, 240, 177)"
        p={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                backgroundColor="rgb(104, 150, 104)"
                bgcolor={
                  message.role === "assistant"
                    ? "rgb(59, 115, 59)"
                    : "rgb(104, 150, 104)"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            InputLabelProps={{
              style: { color: "darkgreen" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "green",
                },
                "&:hover fieldset": {
                  borderColor: "darkgreen",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "darkgreen",
                },
              },
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" sx={buttonSX} onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
