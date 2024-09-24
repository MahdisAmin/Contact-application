import { useContext, createContext, useReducer } from "react";
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
    case "DELETE_SELECTED_CONTACT":
      return state.filter((contact) => !contact.cheched);
    case "SET_CONTACT":
      return action.payload;
    default:
      return state;
  }
};

export const ContactProvider = ({ Children }) => {
  const [contacts, dispatch] = useReducer(contactReducer, []);
  return (
    <ContactContext.Provider value={{ contacts, dispatch }}>
      {Children}
    </ContactContext.Provider>
  );
};
export const useContacts = () => useContext(ContactContext);
