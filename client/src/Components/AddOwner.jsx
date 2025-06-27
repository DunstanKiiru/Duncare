import React, { useState } from 'react';

const AddOwner = ({ onAddOwner }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!name || !email || !phone) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone })
      });

      if (response.ok) {
        const newOwner = await response.json();
        setMessage('Owner added successfully!');
        setName('');
        setEmail('');
        setPhone('');
        if (onAddOwner) {
          onAddOwner(newOwner);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add owner.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Add Owner</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label><br />
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label><br />
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Owner</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddOwner;
