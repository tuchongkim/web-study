// 컨트롤러에서 async-handler를 사용해 예외처리를 간단하게 작성
const asyncHandler = require("express-async-handler");

// 데이터베이스 모델을 연결해서 사용하기 위해 모델을 import
const Contact = require("../models/contactModel");


// @desc Get all contacts
// @route GET /contacts
const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    res.render("index", { contacts: contacts });  // Contact 모델에서 가져온 데이터를 contacts 변수에 저장했는데, 그 변수를 index.ejs 파일에 전달
});

// @desc View add contact form
// @route Get /contacts/add
const addContactForm = (req, res) => {
    res.render("add");
};

// @desc Create a contact
// @route POST /contacts/add
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
    res.redirect("/contacts");
});

// @desc Get contact
// @route Get /contacts/:id
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.render("update", { contact: contact });
});

// @desc Update contact
// @route PUT /contacts/:id
const updateContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(
        id,
        { name, email, phone },
        { new: true }  // 수정한 결과(도큐먼트)를 화면에 보여주고 싶을 때 사용
    );
    res.redirect("/contacts");  // 정보가 수정된 후 전제 연락처 정보를 화면에 표시
});

// @desc Delete contact
// @route DELETE /contacts/:id
const deleteContact = asyncHandler(async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect("/contacts");
});

module.exports = { 
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm,
};