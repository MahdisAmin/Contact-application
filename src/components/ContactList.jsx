import React from "react";
import "./ContactList.css";
function ContactList({
  contacts,
  setCurrentContact,
  deleteContact,
  openEditModal,
}) {
  return (
    <ul className="contact-item">
      {contacts.map((contact) => (
        // <li key={contact.id}>
          <div className="contact-list">
            <li className="user-avatar">
              {/* <li key={contact.id}> */}
              {contact.photo && (
                <img
                  className="avatar"
                  src={contact.photo}
                  alt={`${contact.firstName} ${contact.lastName}`}
                />
              )}
              {/* </li> */}
              {contact.firstName} {contact.lastName}
            </li>
            <li>📞{contact.phone}</li>
            <li>📩{contact.email}</li>

            <div className="contact-actions">
              <button
                onClick={() => {
                  setCurrentContact(contact);
                  openEditModal();
                }}
              >
                🖋
              </button>
              <button onClick={() => deleteContact(contact)}>🚮</button>
            </div>
          </div>
        // </li>
      ))}
    </ul>
  );
}

export default ContactList;
