import React, { useEffect, useState } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import SearchBar from "./components/SearchBar";
import { ContactProvider, useContacts } from "./components/ContactContext";
import "./App.css";

function AppContent() {
  const { contacts, dispatch } = useContacts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const fetchContacts = () => {
    fetch("http://localhost:3000/contacts")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "SET_CONTACTS", payload: data }))
      .catch((error) => console.error("Error fetching contacts:", error));
  };

  useEffect(() => {
    fetchContacts();
  }, [dispatch]);

  const addContact = (contact) => {
    fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    })
      .then((response) => response.json())
      .then(() => {
        fetchContacts();
      })
      .catch((error) => console.error("Error adding contact:", error));
  };

  const updateContact = (updatedContact) => {
    fetch(`http://localhost:3000/contacts/${updatedContact.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContact),
    })
      .then((response) => response.json())
      .then(() => {
        fetchContacts();
      })
      .catch((error) => console.error("Error updating contact:", error));
  };

  const deleteContact = (id) => {
    fetch(`http://localhost:3000/contacts/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchContacts();
      })
      .catch((error) => console.error("Error deleting contact:", error));
  };

  const deleteSelectedContacts = () => {
    const selectedContacts = contacts.filter((contact) => contact.checked);
    const deletePromises = selectedContacts.map((contact) =>
      fetch(`http://localhost:3000/contacts/${contact.id}`, {
        method: "DELETE",
      })
    );

    Promise.all(deletePromises)
      .then(() => {
        fetchContacts();
        setIsDeleteModalOpen(false);
        setShowCheckboxes(false);
      })
      .catch((error) =>
        console.error("Error deleting selected contacts:", error)
      );
  };

  const handleDeleteButtonClick = () => {
    if (showCheckboxes) {
      setIsDeleteModalOpen(true);
    } else {
      setShowCheckboxes(true);
    }
  };

  const handleCheckboxChange = (id) => {
    dispatch({ type: "TOGGLE_CHECKBOX", payload: id });
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <SearchBar setSearchTerm={setSearchTerm} />
        <button
          onClick={() => {
            setIsEditModalOpen(true);
            setCurrentContact(null);
          }}
        >
          Add Contact
        </button>
        <button onClick={handleDeleteButtonClick}>
          {showCheckboxes ? "Delete Selected" : "Delete All"}
        </button>
        {isEditModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setIsEditModalOpen(false)}>
                ×
              </span>
              <ContactForm
                addContact={addContact}
                updateContact={updateContact}
                currentContact={currentContact}
                closeModal={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsDeleteModalOpen(false)}>
              ×
            </span>
            <p>Are you sure you want to delete the selected contacts?</p>
            <button onClick={deleteSelectedContacts}>Yes</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
      <ContactList
        contacts={filteredContacts}
        setCurrentContact={setCurrentContact}
        deleteContact={deleteContact}
        openEditModal={() => setIsEditModalOpen(true)}
        showCheckboxes={showCheckboxes}
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
}

function App() {
  return (
    <ContactProvider>
      <AppContent />
    </ContactProvider>
  );
}

export default App;
