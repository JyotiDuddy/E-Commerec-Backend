const express = require("express");

const router= express.Router();

const { addLegalDocument, getAllLegalDocumentAdmin, getSingleLegalDocument,updatelegalDocument,deleteLegalDocument ,getLegalDocument} = require("../controllers/legal.controller");


// Public Route 



// Get legal doucmnet 
router.get("/active/:type",getLegalDocument)



// Admin Route


//add Legal
router.post("/admin/add",addLegalDocument);

// Get all Legal
router.get("/admin/all",getAllLegalDocumentAdmin);

// Get single Legal

router.get("/admin/:id",getSingleLegalDocument);

// delete Legal
router.delete("/admin/delete/:id",deleteLegalDocument);


// update Legal
router.put("/admin/update/:id",updatelegalDocument);


module.exports= router;