import React from "react";
import "./ContactList.css";

function ContactList({
  contacts,
  setCurrentContact,
  deleteContact,
  openEditModal,
  isDeleteMode,
  selectedContacts,
  handleCheckboxChange,
}) {
  return (
    <ul className="contact-item">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <div className="contact-list">
            {isDeleteMode && (
              <input
                type="checkbox"
                className={`checkbox ${isDeleteMode}? 'show' : ""`}
                checked={selectedContacts.includes(contact.id)}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            )}
            {contact.photo && (
              <img
                className="avatar"
                src={contact.photo}
                alt={`${contact.firstName} ${contact.lastName}`}
              />
            )}
            {contact.firstName} {contact.lastName}
            <div>{contact.phone}</div>
            <div>{contact.email}</div>
            <div className="contact-actions">
              <button
                className="Edit-btn"
                onClick={() => {
                  setCurrentContact(contact);
                  openEditModal();
                }}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteContact(contact)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ContactList;
