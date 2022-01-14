import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />)
});

test('renders the contact form header', ()=> {
    render(<ContactForm />)
    screen.getByText(/Contact Form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/First Name*/i)
    userEvent.type(firstNameInput, 'LT5C')
    const didError = await screen.getByText(/must have at least 5 characters/i)
    expect(didError).toBeInTheDocument()
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    const AllErrors = await screen.getAllByTestId('error')
    expect(AllErrors).toHaveLength(3)
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/First Name*/i)
    userEvent.type(firstNameInput, 'Valid')

    const LastNameInput = screen.getByLabelText(/Last Name*/i)
    userEvent.type(LastNameInput, 'Valid')

    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    const emailError = await screen.getByText(/must be a valid email address./i)
    expect(emailError).toBeInTheDocument
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText(/Email*/i)
    userEvent.type(emailInput, 'NotValid')

    const emailError = await screen.getByText(/must be a valid email address./i)
    expect(emailError).toBeInTheDocument
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)

    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)

    const LastNameError = await screen.getByText(/is a required field./i)
    expect(LastNameError).toBeInTheDocument()
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/First Name*/i)
    userEvent.type(firstNameInput, 'ValidFirstName')

    const LastNameInput = screen.getByLabelText(/Last Name*/i)
    userEvent.type(LastNameInput, 'ValidLastName')

    const emailInput = screen.getByLabelText(/Email*/i)
    userEvent.type(emailInput, 'ValidEmail@gmail.com')

    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)


    const output = await {
        FirstName: screen.queryByText('ValidFirstName'),
        LastName: screen.queryByText('ValidLastName'),
        Email: screen.queryByText('ValidEmail@gmail.com'),
        Message: screen.queryByText('Email: ')
    }

    expect(output.FirstName).toBeInTheDocument()
    expect(output.LastName).toBeInTheDocument()
    expect(output.Email).toBeInTheDocument()
    expect(output.Message).not.toBeInTheDocument()
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/First Name*/i)
    userEvent.type(firstNameInput, 'ValidFirstName')

    const LastNameInput = screen.getByLabelText(/Last Name*/i)
    userEvent.type(LastNameInput, 'ValidLastName')

    const emailInput = screen.getByLabelText(/Email*/i)
    userEvent.type(emailInput, 'ValidEmail@gmail.com')

    const messageInput = screen.getByLabelText(/Message/i)
    userEvent.type(messageInput, 'This is a message')

    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)


    const output = await {
        FirstName: screen.queryByText('ValidFirstName'),
        LastName: screen.queryByText('ValidLastName'),
        Email: screen.queryByText('ValidEmail@gmail.com'),
        Message: screen.queryByText('This is a message')
    }

    expect(output.FirstName).toBeInTheDocument()
    expect(output.LastName).toBeInTheDocument()
    expect(output.Email).toBeInTheDocument()
    expect(output.Message).toBeInTheDocument()
});