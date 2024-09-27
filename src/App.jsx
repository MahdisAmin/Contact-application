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
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  useEffect(() => {
    // Fetch contacts from JSON Server only once on component mount
    fetch("http://localhost:3000/contacts")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "SET_CONTACTS", payload: data }))
      .catch((error) => console.error("Error fetching contacts:", error));
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
      .then((data) => {
        dispatch({ type: "ADD_CONTACT", payload: data });
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
      .then((data) => {
        dispatch({ type: "UPDATE_CONTACT", payload: data });
      })
      .catch((error) => console.error("Error updating contact:", error));
  };

  const deleteContact = (id) => {
    fetch(`http://localhost:3000/contacts/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        dispatch({ type: "DELETE_CONTACT", payload: id });
        setContactToDelete(null); // Close the modal after deletion
        setIsConfirmDeleteModalOpen(false); // Close the confirm delete modal
      })
      .catch((error) => console.error("Error deleting contact:", error));
  };

  const confirmDeleteContact = (id) => {
    setContactToDelete(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const deleteSelectedContacts = () => {
    const selectedContacts = contacts.filter((contact) => contact.checked);
    if (selectedContacts.length === 0) {
      alert("No contacts selected for deletion.");
      return;
    }
    const deletePromises = selectedContacts.map((contact) =>
      fetch(`http://localhost:3000/contacts/${contact.id}`, {
        method: "DELETE",
      })
    );

    Promise.all(deletePromises)
      .then(() => {
        selectedContacts.forEach((contact) => {
          dispatch({ type: "DELETE_CONTACT", payload: contact.id });
        });
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
      contact?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      {isConfirmDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setIsConfirmDeleteModalOpen(false)}
            >
              ×
            </span>
            <p>Are you sure you want to delete this contact?</p>
            <button onClick={() => deleteContact(contactToDelete)}>Yes</button>
            <button onClick={() => setIsConfirmDeleteModalOpen(false)}>
              No
            </button>
          </div>
        </div>
      )}
      <ContactList
        contacts={filteredContacts}
        setCurrentContact={setCurrentContact}
        confirmDeleteContact={confirmDeleteContact}
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
