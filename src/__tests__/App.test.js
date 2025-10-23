// File: src/__tests__/App.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import '@testing-library/jest-dom';

// === pizza tests (kept exact and first) ===

// pizza checkbox is initially unchecked
test("pizza checkbox is initially unchecked", () => {
  render(<App />);

  const addPepperoni = screen.getByRole("checkbox", { name: /add pepperoni/i });

  expect(addPepperoni).not.toBeChecked();
});

// Size select element
test("size select element initially displays 'Small'", () => {
  render(<App />);

  const selectSize = screen.getByLabelText(/select size/i);

  expect(selectSize).toHaveDisplayValue("Small");
});

test("select Size dropdown displays the user's selected value", async () => {
  render(<App />);

  const selectSize = screen.getByLabelText(/select size/i);

  // selectOptions can accept the value string
  await userEvent.selectOptions(selectSize, "medium");
  expect(selectSize).toHaveDisplayValue("Medium");

  await userEvent.selectOptions(selectSize, "large");
  expect(selectSize).toHaveDisplayValue("Large");
});

// "Your Selection" text
test("'Your Selection' message initially displays 'small cheese'", () => {
  render(<App />);

  expect(screen.getByText(/small cheese/i)).toBeInTheDocument();
});

test("selecting options updates the 'Your selection' message", async () => {
  render(<App />);

  const addPepperoni = screen.getByRole("checkbox", { name: /add pepperoni/i });
  const selectSize = screen.getByLabelText(/select size/i);

  await userEvent.click(addPepperoni);
  expect(screen.getByText(/small pepperoni/i)).toBeInTheDocument();

  await userEvent.selectOptions(selectSize, "large");
  expect(screen.getByText(/large pepperoni/i)).toBeInTheDocument();
});

// Contact Info text box
test("'Contact Info' text box initially displays a placeholder value of 'email address'", () => {
  render(<App />);

  expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
});

test("the page shows information the user types into the contact form field", async () => {
  render(<App />);

  const contact = screen.getByLabelText(/enter your email address/i);

  await userEvent.type(contact, "pizzafan@email.com");

  expect(contact).toHaveValue("pizzafan@email.com");
});

// Submit Order button
test("form contains a 'Submit Order' button", () => {
  render(<App />);

  expect(screen.getByRole("button", { name: /submit order/i })).toBeInTheDocument();
});

test("clicking the Place Order button displays a thank you message", async () => {
  render(<App />);

  await userEvent.click(screen.getByRole("button", { name: /submit order/i }));

  expect(screen.getByText(/thanks for your order!/i)).toBeInTheDocument();
});

/* ===========================
   Newsletter Signup Tests (new)
   =========================== */

// initial presence of newsletter section
test("newsletter section shows a signup form initially", () => {
  render(<App />);

  // heading and form fields
  expect(screen.getByRole("heading", { name: /newsletter signup/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/name:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email address:/i)).toBeInTheDocument();

  // checkboxes for interests
  expect(screen.getByRole("checkbox", { name: /web development/i })).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: /design/i })).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: /testing/i })).toBeInTheDocument();

  // sign up button
  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
});

// typing into name and email updates their values
test("typing into name and email updates the inputs' values", async () => {
  render(<App />);

  const nameInput = screen.getByLabelText(/name:/i);
  const emailInput = screen.getByLabelText(/email address:/i);

  await userEvent.type(nameInput, "Ada Lovelace");
  await userEvent.type(emailInput, "ada@example.com");

  expect(nameInput).toHaveValue("Ada Lovelace");
  expect(emailInput).toHaveValue("ada@example.com");
});

// selecting interests toggles checkboxes and the form accepts them
test("user can select interests and submit the signup form", async () => {
  render(<App />);

  const nameInput = screen.getByLabelText(/name:/i);
  const emailInput = screen.getByLabelText(/email address:/i);
  const webCheckbox = screen.getByRole("checkbox", { name: /web development/i });
  const designCheckbox = screen.getByRole("checkbox", { name: /design/i });
  const signupButton = screen.getByRole("button", { name: /sign up/i });

  await userEvent.type(nameInput, "Grace Hopper");
  await userEvent.type(emailInput, "grace@example.com");

  // select two interests
  await userEvent.click(webCheckbox);
  await userEvent.click(designCheckbox);

  expect(webCheckbox).toBeChecked();
  expect(designCheckbox).toBeChecked();

  // submit the form
  await userEvent.click(signupButton);

  // After submit: personalized message appears
  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByText(/thank you, grace hopper!/i)).toBeInTheDocument();
  expect(screen.getByText(/you've signed up with grace@example\.com/i)).toBeInTheDocument();

  // interests should be listed
  expect(screen.getByText(/your interests:/i)).toBeInTheDocument();
  expect(screen.getByText(/web development/i)).toBeInTheDocument();
  expect(screen.getByText(/design/i)).toBeInTheDocument();

  // testing (not selected) should not appear as selected item
  expect(screen.queryByText(/testing/i)).not.toBeInTheDocument();
});

// submitting with no interests displays 'You didn't select any interests.'
test("submitting without selecting interests shows a 'no interests' message", async () => {
  render(<App />);

  const nameInput = screen.getByLabelText(/name:/i);
  const emailInput = screen.getByLabelText(/email address:/i);
  const signupButton = screen.getByRole("button", { name: /sign up/i });

  await userEvent.type(nameInput, "No Interest User");
  await userEvent.type(emailInput, "none@example.com");

  // Don't click any interests
  await userEvent.click(signupButton);

  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByText(/you didn't select any interests\./i)).toBeInTheDocument();
});