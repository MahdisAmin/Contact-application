import React from "react";
import "./ContactList.css";

function ContactList({
  contacts,
  setCurrentContact,
  confirmDeleteContact,
  openEditModal,
  showCheckboxes,
  handleCheckboxChange,
}) {
  return (
    <ul className="contact-item">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <div className="contact-list">
            {showCheckboxes && (
              <input className="checkbox"
                type="checkbox"
                checked={contact.checked || false}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            )}
            <div className="user-avatar">
              {contact.photo && (
                <img
                  className="avatar"
                  src={contact.photo}
                  alt={`${contact.firstName} ${contact.lastName}`}
                />
              )}
              {contact.firstName} {contact.lastName}
            </div>
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
                onClick={() => confirmDeleteContact(contact.id)}
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
