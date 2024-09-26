import React, { useState, useEffect } from "react";
import "./ContactForm.css";

function ContactForm({
  addContact,
  updateContact,
  currentContact,
  closeModal,
}) {
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    photo: null,
    checked: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentContact) {
      setContact(currentContact);
    }
  }, [currentContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setContact({ ...contact, photo: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !contact.firstName ||
      !contact.lastName ||
      !contact.phone ||
      !contact.email
    ) {
      setError("All fields are required.");
      return;
    }
    if (!validateEmail(contact.email)) {
      setError("Please enter a valid email");
      return;
    }
    if (currentContact) {
      updateContact(contact);
    } else {
      addContact({ ...contact, id: Math.random() });
    }
    setContact({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      photo: null,
      checked: false,
    });
    setError("");
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={contact.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={contact.lastName}
        onChange={handleChange}
      />
      <input
        type="number"
        name="phone"
        placeholder="Phone"
        value={contact.phone}
        onChange={handleChange}
      />
      <input
        type="text"
        name="email"
        placeholder="Email"
        value={contact.email}
        onChange={handleChange}
      />
      <input type="file" name="photo" onChange={fileChangeHandler} />
      <button type="submit">
        {currentContact ? "Update Contact" : "Add Contact"}
      </button>
    </form>
  );
}

export default ContactForm;
