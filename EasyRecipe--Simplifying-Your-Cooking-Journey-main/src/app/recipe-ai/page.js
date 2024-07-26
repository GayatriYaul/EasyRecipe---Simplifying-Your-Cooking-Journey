// : This indicates that the module is a client component, intended to run in the browser.
"use client"
import React, { useState } from 'react';
import NavBar from '@/components/NavBar'; // Adjust the path based on your project structure
import { FaUser } from "react-icons/fa"; // Imports icons from the react-icons library to use in the UI.
import { RiRobot2Line } from "react-icons/ri";

function RecipeChatbot() {
  const [prompt, setPrompt] = useState('');
  const [isNewMessage, setIsNewMessage] = useState(true);
  const [responses, setResponses] = useState(["How can I help you?"]); // : An array to store the conversation history
  const [isLoading, setIsLoading] = useState(false);

  const handlePrompt = async (e) => {
    e.preventDefault();
    if (!prompt) return;


    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/chef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt, isNew: isNewMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPrompt('');
      setIsNewMessage(false);
      setResponses([...responses, prompt, data.response]);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  /*
  Purpose: This function is used to safely render HTML content within a React component.
Input: It takes a string containing HTML (htmlString).
Output: It returns an object with a key __html and the value of htmlString.
Why?: React's default behavior escapes HTML to prevent XSS (Cross-Site Scripting) attacks.
 However, sometimes you need to render HTML content directly, 
 and React provides a way to do this safely using
  the dangerouslySetInnerHTML attribute.
  */ 
  // Function to render HTML tags properly
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <div>
      <NavBar />

      {/* Chat bubbles */}
      {/*responses.map: Iterates over the responses array and renders each message as a chat bubble.
      RiRobot2Line and FaUser: Conditionally renders the robot or user icon based on the message index.*/ }
      {responses.map((response, index) => (
        <div key={index} className={`flex items-start gap-2.5 mt-3 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
          {
            index % 2 === 0 ? <RiRobot2Line className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 p-2" /> : <FaUser className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 p-2" />
          }
          <div className={`flex flex-col w-full max-w-[500px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-lg dark:bg-gray-700 ${index % 2 === 0 ? 'rounded-l-lg rounded-br-lg' : 'rounded-r-lg rounded-bl-lg'}`}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{index % 2 === 0 ? 'Recipe Ai' : 'You'}</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> {
                // display time
                new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
              } </span>
            </div> {/*  Safely renders HTML content from the responses. */}
            <div className="text-sm font-normal py-2.5 text-gray-900 dark:text-white" dangerouslySetInnerHTML={renderHTML(response)}></div>
          </div>
        </div>
      ))}

      {/* Chat input form */}
      <form className="flex items-center gap-2.5 mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg dark:shadow-dark-lg" onSubmit={handlePrompt}>
        <input type="text" placeholder="Type a message" className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default RecipeChatbot;
