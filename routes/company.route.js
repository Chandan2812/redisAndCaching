const express = require("express");
const { CompanyModel } = require("../models/company.model");

const companyRouter = express.Router();

// 1. Create a New Company
companyRouter.post("/", async (req, res) => {
    try {
        const { name, symbol } = req.body;
        // Check if the company with the given symbol already exists
        const existingCompany = await CompanyModel.findOne({ symbol });
        if (existingCompany) {
            return res.status(400).json({ error: "Company with this symbol already exists" });
        }
        // Create a new company
        const newCompany = new CompanyModel({ name, symbol });
        await newCompany.save();
        res.status(201).json(newCompany);
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2. Read Companies
// 2.1. Get all companies
companyRouter.get("/", async (req, res) => {
    try {
        const companies = await CompanyModel.find();
        res.json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2.2. Get a specific company by symbol
companyRouter.get("/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const company = await CompanyModel.findOne({ symbol });
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.json(company);
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 3. Update Company
companyRouter.put("/:id", async (req, res) => {
    try {
        const { name, symbol } = req.body;
        const companyId = req.params.id;
        // Check if the company with the given ID exists
        const existingCompany = await CompanyModel.findById(companyId);
        if (!existingCompany) {
            return res.status(404).json({ error: "Company not found" });
        }
        // Update the company
        existingCompany.name = name;
        existingCompany.symbol = symbol;
        await existingCompany.save();
        res.json(existingCompany);
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Delete Company
companyRouter.delete("/:id", async (req, res) => {
    try {
        const companyId = req.params.id;
        // Check if the company with the given ID exists
        const existingCompany = await CompanyModel.findById(companyId);
        if (!existingCompany) {
            return res.status(404).json({ error: "Company not found" });
        }
        // Delete the company
        await CompanyModel.findByIdAndDelete(companyId);
        res.json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = {companyRouter};
