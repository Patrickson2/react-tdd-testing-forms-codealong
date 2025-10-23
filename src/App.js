// src/App.js
import React, { useState } from "react";

export default function App() {
  // Pizza ordering state
  const [pepperoniIsChecked, setPepperoniIsChecked] = useState(false);
  const [size, setSize] = useState("small");
  const [contactInfo, setContactInfo] = useState("");
  const [orderIsSubmitted, setOrderIsSubmitted] = useState(false);

  const togglePepperoni = (e) => setPepperoniIsChecked(e.target.checked);
  const selectSize = (e) => setSize(e.target.value);
  const updateContactField = (e) => setContactInfo(e.target.value);
  const submitOrder = (e) => {
    e.preventDefault();
    setOrderIsSubmitted(true);
  };

  // Newsletter signup state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState({
    "web development": false,
    design: false,
    testing: false,
  });
  const [signupSubmitted, setSignupSubmitted] = useState(false);
  const [signupData, setSignupData] = useState(null);

  const toggleInterest = (e) => {
    const key = e.target.value;
    setInterests((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const submitSignup = (e) => {
    e.preventDefault();
    const selected = Object.entries(interests)
      .filter(([k, v]) => v)
      .map(([k]) => k);

    const data = {
      name,
      email,
      interests: selected,
    };

    setSignupData(data);
    setSignupSubmitted(true);
  };

  return (
    <div>
      {/* Pizza ordering UI */}
      <h1>Place an Order</h1>

      <p>
        Your selection: {size} {pepperoniIsChecked ? "pepperoni" : "cheese"}
      </p>

      <form onSubmit={submitOrder}>
        <div>
          <h3>Toppings</h3>
          <input
            type="checkbox"
            id="pepperoni"
            checked={pepperoniIsChecked}
            aria-checked={pepperoniIsChecked}
            onChange={togglePepperoni}
          />
          <label htmlFor="pepperoni">Add pepperoni</label>
        </div>

        <div>
          <h3>Size</h3>
          <label htmlFor="select-size">Select size: </label>
          <select id="select-size" value={size} onChange={selectSize}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <h3>Contact Info</h3>

          {/* pizza label: contains "enter your email address" (no colon) so pizza test finds it */}
          <label htmlFor="email">Enter your email address</label>
          <input
            type="text"
            value={contactInfo}
            id="email"
            placeholder="email address"
            onChange={updateContactField}
          />
        </div>

        <button type="submit">Submit Order</button>
      </form>

      {orderIsSubmitted ? <h2>Thanks for your order!</h2> : null}

      <hr />

      {/* Newsletter signup UI */}
      <section aria-labelledby="newsletter-heading">
        <h2 id="newsletter-heading">Newsletter Signup</h2>

        {!signupSubmitted ? (
          <form onSubmit={submitSignup}>
            <div>
              <label htmlFor="signup-name">Name:</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              {/* signup label includes colon so regex /email address:/i matches only this one */}
              <label htmlFor="signup-email">Email address:</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <fieldset>
              <legend>Select your interests</legend>

              <div>
                <input
                  id="interest-web"
                  type="checkbox"
                  value="web development"
                  checked={interests["web development"]}
                  onChange={toggleInterest}
                />
                <label htmlFor="interest-web">Web Development</label>
              </div>

              <div>
                <input
                  id="interest-design"
                  type="checkbox"
                  value="design"
                  checked={interests["design"]}
                  onChange={toggleInterest}
                />
                <label htmlFor="interest-design">Design</label>
              </div>

              <div>
                <input
                  id="interest-testing"
                  type="checkbox"
                  value="testing"
                  checked={interests["testing"]}
                  onChange={toggleInterest}
                />
                <label htmlFor="interest-testing">Testing</label>
              </div>
            </fieldset>

            <button type="submit">Sign Up</button>
          </form>
        ) : (
          <div role="status">
            <h3>Thank you, {signupData?.name}!</h3>
            <p>You've signed up with {signupData?.email}.</p>

            {signupData?.interests && signupData.interests.length > 0 ? (
              <div>
                <p>Your interests:</p>
                <ul>
                  {signupData.interests.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>You didn't select any interests.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}