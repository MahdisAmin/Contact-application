import React, { useEffect, useState } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import SearchBar from "./components/SearchBar";
import "./App.css";

function AppContent() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  useEffect(() => {
    const storedContacts = localStorage.getItem("contacts");
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  const saveContactsToLocalStorage = (contacts) => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  };

  const addContact = (contact) => {
    const newContacts = [...contacts, contact];
    setContacts(newContacts);
    saveContactsToLocalStorage(newContacts);
  };

  const updateContact = (updatedContact) => {
    const newContacts = contacts.map((contact) =>
      contact.id === updatedContact.id ? updatedContact : contact
    );
    setContacts(newContacts);
    saveContactsToLocalStorage(newContacts);
  };

  const deleteContact = (id) => {
    const newContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(newContacts);
    saveContactsToLocalStorage(newContacts);
    setContactToDelete(null); // Close the modal after deletion
    setIsConfirmDeleteModalOpen(false); // Close the confirm delete modal
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
    const newContacts = contacts.filter((contact) => !contact.checked);
    setContacts(newContacts);
    saveContactsToLocalStorage(newContacts);
    setIsDeleteModalOpen(false);
    setShowCheckboxes(false);
  };

  const handleDeleteButtonClick = () => {
    if (showCheckboxes) {
      setIsDeleteModalOpen(true);
    } else {
      setShowCheckboxes(true);
    }
  };

  const handleCheckboxChange = (id) => {
    const newContacts = contacts.map((contact) =>
      contact.id === id ? { ...contact, checked: !contact.checked } : contact
    );
    setContacts(newContacts);
    saveContactsToLocalStorage(newContacts);
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

export default AppContent;
