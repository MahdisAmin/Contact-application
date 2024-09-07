import React, { useEffect, useState } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState(() => {
    const savedContact = localStorage.getItem("contacts");
    return savedContact ? JSON.parse(savedContact) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contact) => {
    setContacts([...contacts, contact]);
  };

  const updateContact = (updatedContact) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    setContactToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const toggleDeleteMode = () => {
    if (isDeleteMode) {
      setIsConfirmModalOpen(true);
    } else {
      setIsDeleteMode(true);
    }
  };

  const confirmDeleteSelected = () => {
    setContacts(
      contacts.filter((contact) => !selectedContacts.includes(contact.id))
    );
    setSelectedContacts([]);
    setIsDeleteMode(false);
    setIsConfirmModalOpen(false);
  };

  const handleCheckboxChange = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id)
        ? prev.filter((contactId) => contactId !== id)
        : [...prev, id]
    );
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLocaleLowerCase())
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
        {contacts.length > 0 && (
          <button onClick={toggleDeleteMode}>
            {isDeleteMode ? "Delete Selected" : "Delete All"}
          </button>
        )}

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
      {isDeleteModalOpen && contactToDelete && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsDeleteModalOpen(false)}>
              ×
            </span>
            <p>
              Are you sure you want to delete {contactToDelete.firstName}{" "}
              {contactToDelete.lastName}?
            </p>
            <button onClick={() => deleteContact(contactToDelete.id)}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
      {isConfirmModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              ×
            </span>
            <p>Are you sure you want to delete the selected contacts?</p>
            <button onClick={confirmDeleteSelected}>Yes</button>
            <button onClick={() => setIsConfirmModalOpen(false)}>No</button>
          </div>
        </div>
      )}
      <ContactList
        contacts={filteredContacts}
        setCurrentContact={setCurrentContact}
        deleteContact={confirmDelete}
        openEditModal={() => setIsEditModalOpen(true)}
        isDeleteMode={isDeleteMode}
        selectedContacts={selectedContacts}
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
}

export default App;
