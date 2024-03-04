const mongoose=require("mongoose");

const companySchema=mongoose.Schema({
    name: String,
    symbol: String,
})

const CompanyModel=mongoose.model("company",companySchema);

module.exports={CompanyModel}