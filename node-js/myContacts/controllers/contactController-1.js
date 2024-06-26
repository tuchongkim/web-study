// 컨트롤러에서 async-handler를 사용해 예외처리를 간단하게 작성
const asyncHandler = require("express-async-handler");

// 데이터베이스 모델을 연결해서 사용하기 위해 모델을 import
const Contact = require("../models/contactModel");

/*
// async-handler를 사용하지 않는 경우
const getAllContacts = async (req, res) => {
    try {
        res.status(200).send("Contacts Page");
    } catch(error) {
        res.send(error.message);
    }
};
*/


/* async-handler를 사용하는 경우 */

// @desc Get all contacts
// @route GET /contacts
const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
});

// @desc Create a contact
// @route POST /contacts
const createContact = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).send("필수값이 입력되지 않았습니다.");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
    });
    res.status(201).send("Create Contacts");
});

// @desc Get contact
// @route Get /contacts/:id
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.status(200).send(contact);
});

// @desc Update contact
// @route PUT /contacts/:id
const updateContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    const contact = await Contact.findById(id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    // 수정
    contact.name = name;
    contact.email = email;
    contact.phone = phone;

    // 저장
    contact.save();

    res.status(200).json(contact);
});

// @desc Delete contact
// @route DELETE /contacts/:id
const deleteContact = asyncHandler(async (req, res) => {
    res.status(200).send(`Delete Contact for ID: ${req.params.id}`);
});

module.exports = { 
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};