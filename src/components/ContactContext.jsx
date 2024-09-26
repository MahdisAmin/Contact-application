import React, { createContext, useReducer, useContext, useEffect } from "react";

const ContactContext = createContext();

const contactReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CONTACT":
      return [...state, action.payload];
    case "UPDATE_CONTACT":
      return state.map((contact) =>
        contact.id === action.payload.id ? action.payload : contact
      );
    case "DELETE_CONTACT":
      return state.filter((contact) => contact.id !== action.payload);
    case "SET_CONTACTS":
      return action.payload;
    case "TOGGLE_CHECKBOX":
      return state.map((contact) =>
        contact.id === action.payload
          ? { ...contact, checked: !contact.checked }
          : contact
      );
    default:
      return state;
  }
};

export const ContactProvider = ({ children }) => {
  const [contacts, dispatch] = useReducer(contactReducer, []);

  useEffect(() => {
    const fetchContacts = () => {
      fetch("http://localhost:3000/contacts")
        .then((response) => response.json())
        .then((data) => dispatch({ type: "SET_CONTACTS", payload: data }))
        .catch((error) => console.error("Error fetching contacts:", error));
    };

    // Initial fetch
    fetchContacts();

    // Set interval to fetch contacts every 5 seconds
    const intervalId = setInterval(fetchContacts, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [dispatch]);

  return (
    <ContactContext.Provider value={{ contacts, dispatch }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => useContext(ContactContext);
